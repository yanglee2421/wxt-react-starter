export function toDataURL(blob: Blob) {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onerror = (evt) => {
      rej(evt.target?.error);
    };
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === "string") {
        res(result);
        return;
      }

      rej(new Error("result is not string"));
    };
  });
}
