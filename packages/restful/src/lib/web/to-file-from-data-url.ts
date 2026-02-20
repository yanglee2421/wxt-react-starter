export function toFileFromDataURL(params: toFileFromDataURLParams) {
  // ** Params
  const { dataURL, filename } = params;

  const list = dataURL.split(",");
  const mime = list[0].match(/:(.*?);/)?.[1];
  const bstr = atob(dataURL.split(",")[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export interface toFileFromDataURLParams {
  dataURL: string;
  filename: string;
}
