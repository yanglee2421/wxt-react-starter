#define NAPI_CPP_EXCEPTIONS
#include <napi.h>
#include <windows.h>
#include <string>
#include "TOFDPort.h"
#include "js_util.h"

Napi::Value FindWindowWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    LPCWSTR pClassName = NULL;
    std::u16string className;

    if (info[0].IsString()) {
      className = info[0].As<Napi::String>().Utf16Value();
      pClassName = (LPCWSTR)className.c_str();
    }

    LPCWSTR pWindowName = NULL;
    std::u16string windowName;

    if (info[1].IsString()) {
      windowName = info[1].As<Napi::String>().Utf16Value();
      pWindowName = (LPCWSTR)windowName.c_str();
    }

    HWND hwnd = FindWindowW(pClassName, pWindowName);

    return Napi::Number::New(
        env, static_cast<double>(reinterpret_cast<uintptr_t>(hwnd)));
  });
}

Napi::Value SetForegroundWindowWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    double arg_0 = info[0].As<Napi::Number>().DoubleValue();

    HWND hwnd = reinterpret_cast<HWND>(static_cast<uintptr_t>(arg_0));
    BOOL result = SetForegroundWindow(hwnd);
    return Napi::Boolean::New(env, result);
  });
}

struct EnumChildWindowsContext {
  Napi::Env env;
  Napi::Function callback;
};

static BOOL CALLBACK EnumChildWindowsCallbackProc(HWND hwnd, LPARAM lParam) {
  try {
    EnumChildWindowsContext* ctx =
        reinterpret_cast<EnumChildWindowsContext*>(lParam);
    Napi::Value hwndObj = Napi::Number::New(
        ctx->env, static_cast<double>(reinterpret_cast<uintptr_t>(hwnd)));
    Napi::Value result = ctx->callback.Call({hwndObj});

    return result.ToBoolean().Value();
  } catch (...) {
    return FALSE;
  }
}

Napi::Value EnumChildWindowsWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    double arg_0 = info[0].As<Napi::Number>().DoubleValue();

    HWND parentHwnd = reinterpret_cast<HWND>(static_cast<uintptr_t>(arg_0));

    Napi::Function callback = info[1].As<Napi::Function>();
    EnumChildWindowsContext ctx{env, callback};

    BOOL result = EnumChildWindows(
        parentHwnd,
        EnumChildWindowsCallbackProc,
        reinterpret_cast<LPARAM>(&ctx));

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value SendMessageWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    double args_0 = info[0].As<Napi::Number>().DoubleValue();
    uint32_t args_1 = info[1].As<Napi::Number>().Uint32Value();
    int64_t arg_2 = info[2].As<Napi::Number>().Int64Value();

    HWND hwnd = reinterpret_cast<HWND>(static_cast<uintptr_t>(args_0));
    UINT msg = static_cast<UINT>(args_1);
    WPARAM wParam = static_cast<WPARAM>(arg_2);

    UINT timeout = 200;
    if (info.Length() >= 5 && info[4].IsNumber()) {
      timeout = static_cast<UINT>(info[4].As<Napi::Number>().Uint32Value());
    }

    DWORD_PTR dwResult = 0;
    if (info[3].IsString()) {
      std::u16string lParamStr = info[3].As<Napi::String>().Utf16Value();
      SendMessageTimeoutW(
          hwnd,
          msg,
          wParam,
          reinterpret_cast<LPARAM>(lParamStr.c_str()),
          SMTO_ABORTIFHUNG,
          timeout,
          &dwResult);
    } else if (info[3].IsNumber()) {
      LPARAM lParam =
          static_cast<LPARAM>(info[3].As<Napi::Number>().Int64Value());
      SendMessageTimeoutW(
          hwnd, msg, wParam, lParam, SMTO_ABORTIFHUNG, timeout, &dwResult);
    } else {
      Napi::TypeError::New(env, "lParam must be string or number")
          .ThrowAsJavaScriptException();
      return env.Null();
    }

    return Napi::Number::New(env, static_cast<double>(dwResult));
  });
}

Napi::Value GetWindowLongPtrWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    double args1 = info[0].As<Napi::Number>().DoubleValue();
    int32_t args2 = info[1].As<Napi::Number>().Int32Value();

    HWND hwnd = reinterpret_cast<HWND>(static_cast<uintptr_t>(args1));
    int index = static_cast<int>(args2);
    LONG_PTR result = GetWindowLongPtrW(hwnd, index);

    return Napi::BigInt::New(env, static_cast<int64_t>(result));
  });
}

Napi::Value TOFD_PORT_OpenDeviceWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    bool result = TOFDPort::TOFD_PORT_OpenDevice(2);

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value TOFD_PORT_CloseDeviceWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    bool result = TOFDPort::TOFD_PORT_CloseDevice();

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value TOFD_PORT_IsOpenWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    bool result = TOFDPort::TOFD_PORT_IsOpen();

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value TOFD_PORT_SetFrequencyWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    int iFrequency = info[0].As<Napi::Number>().Int32Value();
    bool result = TOFDPort::TOFD_PORT_SetFrequency(iFrequency);

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value ITS_initWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    TOFDPortExtensions::ITS_init();

    return env.Undefined();
  });
}

Napi::Value ITS_IsExistWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    bool result = TOFDPortExtensions::ITS_IsExist();

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value ITS_IsOpenWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    bool result = TOFDPortExtensions::ITS_IsOpen();

    return Napi::Boolean::New(env, result);
  });
}

Napi::Value ITS_SetChWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int ch_left_s = info[0].As<Napi::Number>().Uint32Value();
    unsigned int ch_left_r = info[1].As<Napi::Number>().Uint32Value();
    unsigned int ch_right_s = info[2].As<Napi::Number>().Uint32Value();
    unsigned int ch_right_r = info[3].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetCh(ch_left_s, ch_left_r, ch_right_s, ch_right_r);

    return env.Undefined();
  });
}

Napi::Value ITS_SetPlusWidthWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int plus_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int plus_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetPlusWidth(plus_left, plus_right);

    return env.Undefined();
  });
}

Napi::Value ITS_SetXmoveWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int xmove_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int xmove_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetXmove(xmove_left, xmove_right);

    return env.Undefined();
  });
}

Napi::Value ITS_SetdBWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int dB_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int dB_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetdB(dB_left, dB_right);

    return env.Undefined();
  });
}

Napi::Value ITS_SetDisWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int disW_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int disW_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetDis(disW_left, disW_right);

    return env.Undefined();
  });
}

Napi::Value ITS_SelfcheckWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int ch_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int ch_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_Selfcheck(ch_left, ch_right);

    return env.Undefined();
  });
}

Napi::Value ITS_SetZeroLeavelWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int zl_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int zl_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetZeroLeavel(zl_left, zl_right);

    return env.Undefined();
  });
}

Napi::Value ITS_SetZipWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int zip_left = info[0].As<Napi::Number>().Uint32Value();
    unsigned int zip_right = info[1].As<Napi::Number>().Uint32Value();

    TOFDPortExtensions::ITS_SetZip(zip_left, zip_right);

    return env.Undefined();
  });
}

Napi::Value ITS_GetEncoderWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    unsigned int ch = info[0].As<Napi::Number>().Uint32Value();
    unsigned int mode = info[1].As<Napi::Number>().Uint32Value();

    signed int result = TOFDPortExtensions::ITS_GetEncoder(ch, mode);

    return Napi::Number::New(env, result);
  });
}

Napi::Value ITS_StartWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  return JS::Try(env, [&]() -> Napi::Value {
    Napi::Buffer<unsigned char> buf_left =
        info[0].As<Napi::Buffer<unsigned char>>();
    Napi::Buffer<unsigned char> buf_right =
        info[1].As<Napi::Buffer<unsigned char>>();

    bool result =
        TOFDPortExtensions::ITS_Start(buf_left.Data(), buf_right.Data());

    return Napi::Boolean::New(env, result);
  });
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
      Napi::String::New(env, "findWindow"),
      Napi::Function::New(env, FindWindowWrapped));
  exports.Set(
      Napi::String::New(env, "setForegroundWindow"),
      Napi::Function::New(env, SetForegroundWindowWrapped));
  exports.Set(
      Napi::String::New(env, "enumChildWindows"),
      Napi::Function::New(env, EnumChildWindowsWrapped));
  exports.Set(
      Napi::String::New(env, "sendMessage"),
      Napi::Function::New(env, SendMessageWrapped));
  exports.Set(
      Napi::String::New(env, "getWindowLongPtrW"),
      Napi::Function::New(env, GetWindowLongPtrWrapped));

  // TOFDPort functions
  exports.Set(
      Napi::String::New(env, "TOFD_PORT_OpenDevice"),
      Napi::Function::New(env, TOFD_PORT_OpenDeviceWrapped));
  exports.Set(
      Napi::String::New(env, "TOFD_PORT_CloseDevice"),
      Napi::Function::New(env, TOFD_PORT_CloseDeviceWrapped));
  exports.Set(
      Napi::String::New(env, "TOFD_PORT_IsOpen"),
      Napi::Function::New(env, TOFD_PORT_IsOpenWrapped));
  exports.Set(
      Napi::String::New(env, "TOFD_PORT_SetFrequency"),
      Napi::Function::New(env, TOFD_PORT_SetFrequencyWrapped));

  // TOFDPortExtensions functions
  exports.Set(
      Napi::String::New(env, "ITS_init"),
      Napi::Function::New(env, ITS_initWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_IsExist"),
      Napi::Function::New(env, ITS_IsExistWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_IsOpen"),
      Napi::Function::New(env, ITS_IsOpenWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetCh"),
      Napi::Function::New(env, ITS_SetChWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetPlusWidth"),
      Napi::Function::New(env, ITS_SetPlusWidthWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetXmove"),
      Napi::Function::New(env, ITS_SetXmoveWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetdB"),
      Napi::Function::New(env, ITS_SetdBWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetDis"),
      Napi::Function::New(env, ITS_SetDisWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_Selfcheck"),
      Napi::Function::New(env, ITS_SelfcheckWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetZeroLeavel"),
      Napi::Function::New(env, ITS_SetZeroLeavelWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_SetZip"),
      Napi::Function::New(env, ITS_SetZipWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_GetEncoder"),
      Napi::Function::New(env, ITS_GetEncoderWrapped));
  exports.Set(
      Napi::String::New(env, "ITS_Start"),
      Napi::Function::New(env, ITS_StartWrapped));

  return exports;
}

NODE_API_MODULE(cpp_addon, Init)