import {
  customType,
  integer,
  numeric,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const operLog = sqliteTable("OperLog", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  operDate: numeric("OperDate"),
  operName: customType({ dataType: () => "CHAR(100)" })("OperName"),
  logInfo: customType({ dataType: () => "CHAR(1024)" })("LogInfo"),
});

export const alxInfo = sqliteTable("AlxInfo", {
  alxid: integer("ALXID").primaryKey({ autoIncrement: true }),
  alxname: text("ALXNAME"),
  yblCt: text("YBL_CT"),
  yblXhc: text("YBL_XHC"),
  yblLz: text("YBL_LZ"),
  isdefault: text("ISDEFAULT"),
});

export const quartorChannel = sqliteTable("QuartorChannel", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  nBoardIndex: integer(),
  nChannelIndex: integer(),
  nPhysicsIndex: integer(),
  nWheelIndex: integer(),
  szWheelName: text(),
  szName: text(),
  nSleep: integer(),
  nSmooth: integer(),
  ftRange: real(),
  nPluse: integer(),
  nDelay: integer(),
  nAtten: integer(),
  nDbSub: integer(),
  bActive: integer(),
});

export const quartorGates = sqliteTable("QuartorGates", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  nBoardIndex: integer(),
  nChannelIndex: integer(),
  nChannelRectId: integer(),
  szGateName: text(),
  szGateNameSub: text(),
  nNodeId: integer(),
  szColor: text(),
  bActive: integer(),
  nLeft: integer(),
  nWidth: integer(),
  nTop: integer(),
  bSelected: integer(),
});

export const userManager = sqliteTable("UserManager", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  userName: text("UserName"),
  pwd: text("Pwd"),
  name: text("Name"),
  power: text("Power"),
  regTime: text("RegTime"),
});

export const sysConfig = sqliteTable(
  "SysConfig",
  {
    recId: integer("RecID").primaryKey({ autoIncrement: true }),
    typeName: text("TypeName"),
    configKey: text("ConfigKey"),
    configValue: text("ConfigValue"),
    defaultValue: text("DefaultValue"),
    remark: text("Remark"),
  },
  (table) => [unique("SysConfig_ConfigKey_unique").on(table.configKey)],
);

export const yqConfig = sqliteTable("YQConfig", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  factoryName: text("FactoryName"),
  yqName: text("YQName"),
  yqid: text("YQID"),
  channelNums: integer("ChannelNums"),
  productionDate: text("ProductionDate"),
  installationDate: text("InstallationDate"),
  commMode: integer("CommMode"),
  commParam: text("CommParam"),
  commParamBack: text("CommParamBack"),
  dllPath: text("DllPath"),
  usedFlag: integer("UsedFlag"),
});

export const channels = sqliteTable("Channels", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  nBoardIndex: integer(),
  nChannelIndex: integer(),
  nPhysicsIndex: integer(),
  nWheelIndex: integer(),
  szWheelName: text(),
  szName: text(),
  nSleep: integer(),
  nSmooth: integer(),
  ftRange: real(),
  nPluse: integer(),
  nDelay: integer(),
  nAtten: integer(),
  nDbSub: integer(),
  bActive: integer(),
});

export const gates = sqliteTable("Gates", {
  recId: integer("RecID").primaryKey({ autoIncrement: true }),
  nBoardIndex: integer(),
  nChannelIndex: integer(),
  nChannelRectId: integer(),
  szGateName: text(),
  szGateNameSub: text(),
  nNodeId: integer(),
  szColor: text(),
  bActive: integer(),
  nLeft: integer(),
  nWidth: integer(),
  nTop: integer(),
  nB1Count: integer().default(0),
  nB1Width: integer().default(0),
  nB1Height: integer().default(0),
  nB2Count: integer().default(0),
  nB2Width: integer().default(0),
  nB2Height: integer().default(0),
  nE1Count: integer().default(0),
  nE1Width: integer().default(0),
  nE1Height: integer().default(0),
  nE2Count: integer().default(0),
  nE2Width: integer().default(0),
  nE2Height: integer().default(0),
  bSelected: integer(),
});
