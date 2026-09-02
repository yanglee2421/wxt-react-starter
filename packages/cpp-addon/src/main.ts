import module from "node:module";
import path from "node:path";
import url from "node:url";
import type { CppAddon } from "./types";

const require = module.createRequire(import.meta.url);
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const addonPath = path.resolve(__dirname, "../build/Release/cpp_addon.node");
const addon = require(addonPath) as CppAddon;
export default addon;

export const win32 = () => {
  const windowHandle = addon.findWindow(null, "信息录入 . 现车轮");
  console.log(typeof windowHandle);

  addon.enumChildWindows(windowHandle, (subHandle) => {
    console.log(typeof subHandle, subHandle);

    const contrlId = addon.getWindowLongPtrW(subHandle, -12);
    console.log(typeof contrlId, contrlId.toString(16));

    if (contrlId === BigInt(Number.parseInt("1cc0", 16))) {
      addon.sendMessage(subHandle, 0x00f1, 0, 0);
      addon.setForegroundWindow(windowHandle);
      return false;
    }

    return true;
  });
};
