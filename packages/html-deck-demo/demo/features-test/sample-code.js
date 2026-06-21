// demo/features-test/sample-code.js
// This file is loaded dynamically by the <hd-codeblock> component in index.html.

export class QuickMath {
  /**
   * Calculate the factorial of a number.
   * @param {number} n - Non-negative integer.
   * @returns {number}
   */
  static factorial(n) {
    if (n < 0) return 0;
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  }

  /**
   * Generate Fibonacci sequence up to N elements.
   * @param {number} n 
   * @returns {number[]}
   */
  static fibonacci(n) {
    const sequence = [0, 1];
    if (n <= 1) return [0];
    if (n === 2) return sequence;
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  }
}
