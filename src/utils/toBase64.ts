import Worker from "./worker-base64?worker";

export function toBase64(blob: Blob) {
  return new Promise<string>((res, rej) => {
    const worker = new Worker();
    worker.postMessage(blob);
    worker.onmessage = (evt) => {
      // ** Event
      const { data } = evt;

      // ** Close
      worker.terminate();

      // ** Reject
      if (!data) {
        const err = new Error("invalid blob");
        return rej(err);
      }

      // ** Resolve
      return res(data);
    };
  });
}