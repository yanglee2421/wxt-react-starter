export interface CppAddon {
  findWindow(className: string | null, windowName: string | null): number;
  setForegroundWindow(hwnd: number): boolean;
  enumChildWindows(parentHwnd: number, callback: (hwnd: number) => boolean): boolean;
  sendMessage(
    hwnd: number,
    msg: number,
    wParam: number,
    lParam: number | string,
    timeout?: number,
  ): number;
  getWindowLongPtrW(hwnd: number, index: number): bigint;

  TOFD_PORT_OpenDevice(): boolean;
  TOFD_PORT_CloseDevice(): boolean;
  TOFD_PORT_IsOpen(): boolean;
  TOFD_PORT_SetFrequency(frequency: number): boolean;

  ITS_init(): void;
  ITS_IsExist(): boolean;
  ITS_IsOpen(): boolean;
  ITS_SetCh(
    chLeftSource: number,
    chLeftReceiver: number,
    chRightSource: number,
    chRightReceiver: number,
  ): void;
  ITS_SetPlusWidth(plusLeft: number, plusRight: number): void;
  ITS_SetXmove(xmoveLeft: number, xmoveRight: number): void;
  ITS_SetdB(dbLeft: number, dbRight: number): void;
  ITS_SetDis(disLeft: number, disRight: number): void;
  ITS_Selfcheck(chLeft: number, chRight: number): void;
  ITS_SetZeroLeavel(zeroLevelLeft: number, zeroLevelRight: number): void;
  ITS_SetZip(zipLeft: number, zipRight: number): void;
  ITS_GetEncoder(channel: number, mode: number): number;
  ITS_Start(leftBuffer: Buffer, rightBuffer: Buffer): boolean;
}
