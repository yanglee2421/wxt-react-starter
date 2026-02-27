#! deno run

export function myLabel() {
  outer: for (let i = 0; i < 10; i++) {
    console.log("i", i);
    inner: for (let j = 0; i < 10; j++) {
      console.log("j", j);
      break outer;
    }
  }
}
