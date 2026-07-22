export interface CppAddon {
  findWindow(className: string | null, windowName: string | null): number;
  setForegroundWindow(hwnd: number): boolean;
  enumChildWindows(
    parentHwnd: number,
    callback: (hwnd: number) => boolean,
  ): boolean;
  sendMessage(
    hwnd: number,
    msg: number,
    wParam: number,
    lParam: number | string,
    timeout?: number,
  ): number;
  getWindowLongPtrW(hwnd: number, index: number): bigint;
}
