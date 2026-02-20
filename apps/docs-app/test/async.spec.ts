/**
 * async、await简易原理
 * @returns a generate instance
 */
function* generate() {
  console.log(3);
  yield timeout(1000);
  console.log(2);
  yield timeout(1000);
  console.log(1);
  yield timeout(1000);
  console.log("timeout");
}

function generateHandler(g: ReturnType<typeof generate>) {
  const { value, done } = g.next();
  if (!done) value.then(() => generateHandler(g));
}

function timeout(wait: number) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

const g = generate();
generateHandler(g);
