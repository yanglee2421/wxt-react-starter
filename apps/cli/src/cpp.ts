import addon from "@yanglee2421/cpp-addon";

export const handleMain = () => {
  addon.ITS_init();
  const opend = addon.ITS_IsOpen();
  console.log("ITS_IsOpen result:", opend);
  const setFrequency = addon.TOFD_PORT_SetFrequency(5000);
  console.log("TOFD_PORT_SetFrequency result:", setFrequency);
  addon.ITS_SetCh(1, 1, 0, 0);
  addon.ITS_SetXmove(200, 200);
  addon.ITS_SetdB(900, 900);
  addon.ITS_SetDis(68000, 68000);
  addon.ITS_SetZip(1024, 1024);
  addon.ITS_SetZeroLeavel(0, 0);
  addon.ITS_SetPlusWidth(0x10, 0x10);
  addon.ITS_Selfcheck(0, 0);
  const leftBuffer = Buffer.alloc(8000);
  const rightBuffer = Buffer.alloc(8000);
  addon.ITS_Start(leftBuffer, rightBuffer);
  const rightEncoder = addon.ITS_GetEncoder(1, 1);
  const leftEncoder = addon.ITS_GetEncoder(1, 0);
  console.log("leftEncoder:", leftEncoder, "rightEncoder:", rightEncoder);
  const result = addon.ITS_Start(leftBuffer, rightBuffer);
  console.log("ITS_Start result:", result, leftBuffer, rightBuffer);
};
