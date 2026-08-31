import formidable from "formidable";
import type { Fields, Files, Options } from "formidable";
import type { IncomingMessage } from "node:http";

export function toParseForm(req: IncomingMessage, opts?: Options) {
  const form = formidable(opts);

  return new Promise<Data>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);

        return;
      }
      return resolve({ fields, files });
    });
  });
}

interface Data {
  fields: Fields;
  files: Files;
}
