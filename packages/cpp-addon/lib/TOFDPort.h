#ifndef _TOFDPORT_H_
#define _TOFDPORT_H_

#ifdef DLL_IMPLEMENT
#define Dll_API _declspec(dllexport)
#else
#define Dll_API _declspec(dllimport)
#endif

namespace TOFDPort {
typedef struct _tagNM_DATA {
  int iChannel;
  int iPackage;
  int iAScanSize;
  unsigned char* pAscan;
  int pCoder[2];
  int pCoderZF[2];
  int pCoderZC[2];
  int pCoderZ[2];
  int pGatePos[2];
  unsigned char pGateAmp[2];
  int pAlarm[2];
} NM_DATA, *P_NM_DATA;

// 连接超声板卡
Dll_API bool TOFD_PORT_OpenDevice(int type);
// 断开已连接的超声板
Dll_API bool TOFD_PORT_CloseDevice();
// 判断超声板与电脑是否连接
Dll_API bool TOFD_PORT_IsOpen();
Dll_API bool TOFD_PORT_IsConfigChange();
Dll_API bool TOFD_PORT_IsDeviceExist();
Dll_API bool TOFD_PORT_SetFrequency(int iFrequency);
Dll_API bool TOFD_PORT_SetVoltage(int iVoltage);
Dll_API bool TOFD_PORT_SetChannelFlag(int iChannelFlag);
Dll_API bool TOFD_PORT_SetScanIncrement(int iScanIncrement);
Dll_API bool TOFD_PORT_SetResetCoder(int iResetCoder);
Dll_API bool TOFD_PORT_SetLED(int iLEDStatus);
Dll_API bool TOFD_PORT_SetDamperFlag(int iDamperFlag);
Dll_API bool TOFD_PORT_SetEncoderPulse(int iEncoderPulse);
Dll_API bool TOFD_PORT_SetPulseWidth(int iChannel, float fPulseWidth /*ns*/);
Dll_API bool TOFD_PORT_SetDelay(int iChannel, float fDelay /*us*/);
Dll_API bool TOFD_PORT_SetSampleDepth(int iChannel, float fSampleDepth /*us*/);
Dll_API bool TOFD_PORT_SetSampleFactor(int iChannel, int iSampleFactor);
Dll_API bool TOFD_PORT_SetGain(int iChannel, float fGain /*dB*/);
Dll_API bool TOFD_PORT_SetFilter(int iChannel, int iFilter);
Dll_API bool TOFD_PORT_SetDemodu(int iChannel, int iDemodu);
Dll_API bool TOFD_PORT_SetPhaseReverse(int iChannel, int iPhaseReverse);
Dll_API bool TOFD_PORT_SetGateInfo(
    int iChannel,
    int iGate,
    int iActive,
    int iAlarmType,
    float fPos /*%*/,
    float fWidth /*%*/,
    float fHeight /*%*/);
Dll_API bool TOFD_PORT_SetGate2Type(int iChannel, int iType);
Dll_API bool TOFD_PORT_FlushSetting();
Dll_API bool TOFD_PORT_ReadDatas(unsigned char* pBuff, unsigned int iSize);
Dll_API NM_DATA* TOFD_PORT_ReadDatasFormat();
Dll_API void TOFD_PORT_Free_NM_DATA(NM_DATA* pData);
Dll_API bool TOFD_PORT_GetCoderValue(int* pCoder0, int* pCoder1);
Dll_API bool TOFD_PORT_GetCoderValueZ(
    int* pCoderZ0,
    int* pCoderZ1,
    int* pCoderF0,
    int* pCoderF1,
    int* pCoderC0,
    int* pCoderC1);
Dll_API bool TOFD_PORT_ResetCoder_Immediate();
} // namespace TOFDPort

namespace TOFDPortExtensions {
// 动态库初始化一次
Dll_API void ITS_init();
Dll_API bool ITS_IsExist();
Dll_API bool ITS_IsOpen();
Dll_API bool ITS_OpenUSB();
Dll_API void ITS_CloseUSB();
// 设置通道
Dll_API void ITS_SetCh(
    unsigned int ch_left_s,
    unsigned int ch_left_r,
    unsigned int ch_right_s,
    unsigned int ch_right_r);
// 设置通道频率 [当前取左右设置值的和 hz_left+hz_right 为总重复频率)
Dll_API void ITS_SetHZ(unsigned int hz_left, unsigned int hz_right);
// 设置硬件零点 [In 采样点数 10ns一个点]
Dll_API void ITS_SetHard_Delayns(unsigned int delayns);
// 设置脉冲宽度 [In 单位10ns  例如plus_left = 16 表示160ns]
Dll_API void ITS_SetPlusWidth(unsigned int plus_left, unsigned int plus_right);
// 设置延迟 [In 采样点数 10ns一个点]
Dll_API void ITS_SetXmove(unsigned int xmove_left, unsigned int xmove_right);
// 设置增益
Dll_API void ITS_SetdB(unsigned int dB_left, unsigned int dB_right);
Dll_API void ITS_SetDis(unsigned int dis_left, unsigned int dis_right);
Dll_API void ITS_Selfcheck(unsigned int ch_left, unsigned int ch_right);
Dll_API void ITS_SetZeroLeavel(unsigned int zl_left, unsigned int zl_right);
Dll_API void ITS_TestSetDB(
    unsigned int dB_A1,
    unsigned int dB_A2,
    unsigned int dB_A3,
    unsigned int dB_B1,
    unsigned int dB_B2,
    unsigned int dB_B3);
Dll_API void ITS_TestGetDB(
    unsigned int* dB_A1,
    unsigned int* dB_A2,
    unsigned int* dB_A3,
    unsigned int* dB_B1,
    unsigned int* dB_B2,
    unsigned int* dB_B3);
Dll_API void ITS_SetZip(unsigned int zip_left, unsigned int zip_right);
Dll_API unsigned int ITS_GetZip(unsigned int ch);
// 重置编码器
Dll_API void ITS_ReSetEncoder(unsigned int ch, unsigned int flag);
// 获取编码器的值
Dll_API signed int ITS_GetEncoder(unsigned int ch, unsigned int mode);
// 启动采集
Dll_API bool ITS_Start(unsigned char* buf_left, unsigned char* buf_right);
// 设置编码器频率
Dll_API void ITS_SetEncoder_frequency(unsigned int ch, unsigned int freq);
// 设置编码器频率
Dll_API unsigned int ITS_GetWorkID();
} // namespace TOFDPortExtensions

#endif