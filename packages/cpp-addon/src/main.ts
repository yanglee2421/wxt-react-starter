import { createRequire } from "node:module";
import type { CppAddon } from "./types";

const requrire = createRequire(import.meta.url);
const addon = requrire("../build/Release/cpp_addon.node") as CppAddon;
export default addon;

export const main = () => {
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
