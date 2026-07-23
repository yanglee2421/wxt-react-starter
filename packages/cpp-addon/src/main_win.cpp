#define NAPI_CPP_EXCEPTIONS
#include <napi.h>
#include <windows.h>
#include <string>
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

  return exports;
}

NODE_API_MODULE(cpp_addon, Init)