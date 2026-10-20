#!/usr/bin/env node

/**
 * Validate Runner for html-deck
 * Executes packages/html-deck-validator against slides and demo presentations.
 * 
 * Usage:
 *   npm run validate
 *   npm run validate -- <url>
 */

import { spawn } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const validatorBin = resolve(rootDir, 'packages/html-deck-validator/bin/html-deck-validator.js');

const args = process.argv.slice(2);

// If custom args provided, delegate directly
if (args.length > 0) {
  const child = spawn(process.execPath, [validatorBin, ...args], {
    stdio: 'inherit',
    cwd: rootDir,
  });
  child.on('exit', (code) => process.exit(code || 0));
} else {
  // Batch validation of all targets per Requirement R5
  runBatchValidation().catch((err) => {
    console.error('Validation runner error:', err);
    process.exit(1);
  });
}

function checkUrl(url, expectedContent = null) {
  return new Promise((res) => {
    try {
      const u = new URL(url);
      const req = http.request(
        {
          hostname: u.hostname,
          port: u.port,
          path: u.pathname + u.search,
          method: 'GET',
          timeout: 2000,
        },
        (response) => {
          if (response.statusCode < 200 || response.statusCode >= 400) {
            response.resume();
            return res(false);
          }
          if (!expectedContent) {
            response.resume();
            return res(true);
          }
          let body = '';
          response.setEncoding('utf8');
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', () => {
            res(body.includes(expectedContent));
          });
        }
      );
      req.on('error', () => res(false));
      req.on('timeout', () => {
        req.destroy();
        res(false);
      });
      req.end();
    } catch {
      res(false);
    }
  });
}

function startServer(cwd, port) {
  return new Promise((resolvePromise, reject) => {
    const proc = spawn('npx', ['vite', '--port', String(port), '--strictPort'], {
      cwd,
      stdio: 'pipe',
      shell: true,
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        proc.kill();
        reject(new Error(`Timeout starting Vite on port ${port} in ${cwd}`));
      }
    }, 15000);

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.includes('Local:') || text.includes(`http://localhost:${port}`)) {
        if (!started) {
          started = true;
          clearTimeout(timeout);
          resolvePromise(proc);
        }
      }
    });

    proc.stderr.on('data', (data) => {
      // ignore normal info
    });

    proc.on('exit', (code) => {
      if (!started) {
        clearTimeout(timeout);
        reject(new Error(`Vite exited with code ${code} before starting`));
      }
    });
  });
}

async function runBatchValidation() {
  console.log('\x1b[36m⚡ Running html-deck batch validation across demos and slide decks...\x1b[0m\n');

  const demoDir = resolve(rootDir, 'packages/html-deck-demo');
  const slidesDir = resolve(rootDir, 'packages/slides');

  const servers = [];

  try {
    // 1. Ensure demo server is up (prefer 5173 if it serves demo or is free; else 5175)
    let demoPort = 5173;
    if (await checkUrl('http://localhost:5173/demo/variant-test/index.html', '<hd-deck')) {
      demoPort = 5173;
    } else if (await checkUrl('http://localhost:5175/demo/variant-test/index.html', '<hd-deck')) {
      demoPort = 5175;
    } else {
      const port5173Busy = await checkUrl('http://localhost:5173');
      demoPort = port5173Busy ? 5175 : 5173;
      console.log(`Starting demo server on port ${demoPort}...`);
      const s1 = await startServer(demoDir, demoPort);
      servers.push(s1);
    }

    // 2. Ensure slides server is up (reuse 5174 or 5173 if already serving slides; else start on 5174)
    let slidesPort = 5174;
    if (await checkUrl('http://localhost:5174/slides/introduction/index.html', '<hd-deck')) {
      slidesPort = 5174;
    } else if (await checkUrl('http://localhost:5173/slides/introduction/index.html', '<hd-deck')) {
      slidesPort = 5173;
    } else {
      const port5174Busy = await checkUrl('http://localhost:5174');
      slidesPort = port5174Busy ? 5176 : 5174;
      console.log(`Starting slides server on port ${slidesPort}...`);
      const s2 = await startServer(slidesDir, slidesPort);
      servers.push(s2);
    }

    const themes = [
      'default',
      'dark',
      'warm',
      'corporate',
      'neon',
      'serif',
      'dotted',
      'nouveau',
    ];

    const targets = [
      ...themes.map((theme) => ({
        name: `demo/features (${theme})`,
        url: `http://localhost:${demoPort}/demo/features/index.html${theme === 'default' ? '' : `?theme=${theme}`}`,
      })),
      ...themes.map((theme) => ({
        name: `demo/variant-test (${theme})`,
        url: `http://localhost:${demoPort}/demo/variant-test/index.html?theme=${theme}`,
      })),
      {
        name: 'demo/variant-test (theme-test)',
        url: `http://localhost:${demoPort}/demo/variant-test/index.html`,
      },
      { name: 'slides/introduction', url: `http://localhost:${slidesPort}/slides/introduction/index.html` },
      { name: 'slides/omega', url: `http://localhost:${slidesPort}/slides/omega/index.html` },
      { name: 'slides/ramen', url: `http://localhost:${slidesPort}/slides/ramen/index.html` },
    ];

    let allPassed = true;
    const failures = [];

    for (const target of targets) {
      console.log(`\n\x1b[34m--- Validating ${target.name}: ${target.url} ---\x1b[0m`);
      const code = await new Promise((res) => {
        const child = spawn(process.execPath, [validatorBin, target.url], {
          stdio: 'inherit',
          cwd: rootDir,
        });
        child.on('exit', (c) => res(c || 0));
      });

      if (code !== 0) {
        allPassed = false;
        failures.push(target.name);
      }
    }

    console.log('\n=========================================');
    if (allPassed) {
      console.log('\x1b[32m✔ All validation targets passed successfully (0 violations)!\x1b[0m');
      process.exit(0);
    } else {
      console.error(`\x1b[31m❌ Validation failed for ${failures.length} target(s): ${failures.join(', ')}\x1b[0m`);
      process.exit(1);
    }
  } finally {
    for (const s of servers) {
      try {
        s.kill();
      } catch {}
    }
  }
}
