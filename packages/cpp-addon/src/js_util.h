#pragma once
#define NAPI_CPP_EXCEPTIONS
#include <napi.h>

namespace JS {

template <typename Fn>
static Napi::Value Try(const Napi::Env& env, Fn&& func) {
  try {
    return func();
  } catch (Napi::Error& e) {
    e.ThrowAsJavaScriptException();
  } catch (const std::exception& ex) {
    Napi::Error::New(env, ex.what()).ThrowAsJavaScriptException();
  } catch (...) {
    Napi::Error::New(env, "Unknow Cpp exception").ThrowAsJavaScriptException();
  }

  return env.Null();
}

template <typename Fn, typename OnError>
static void TryExecute(Fn&& func, OnError&& onError) {
  try {
    func();
  } catch (const std::exception& ex) {
    onError(ex.what());
  } catch (...) {
    onError("Unknow Cpp exception");
  }
}

} // namespace JS
