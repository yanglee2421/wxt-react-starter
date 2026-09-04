import path from "node:path";
import url from "node:url";

const getFilename = () => url.fileURLToPath(import.meta.url);
const getDirname = () => path.dirname(getFilename());

export const __filename = /* @__PURE__ */ getFilename();
export const __dirname = /* @__PURE__ */ getDirname();
