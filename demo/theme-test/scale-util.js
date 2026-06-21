// Theme CSS variables customize token colors
function calculateScale(wWidth, wHeight, ratio) {
  const baseHeight = 540;
  const baseWidth = baseHeight * ratio;
  return Math.min(wWidth / baseWidth, wHeight / baseHeight);
}
