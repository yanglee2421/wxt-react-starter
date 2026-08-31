import { timeout } from "./timeout";

export async function retryFetch(failCount = 3) {
  try {
    return await fetch(new URL("/api/joke/list", "https://autumnfish.cn"), {});
  } catch (error) {
    console.log(failCount);

    // Retry fetch
    if (failCount) {
      await timeout(1000 * 3);

      return await retryFetch(failCount - 1);
    }

    console.error(error);
  }
}

retryFetch();
