export function randomRgba() {
  return `rgba(${[
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.random().toFixed(2),
  ].join(",")})`;
}
