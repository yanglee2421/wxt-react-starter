#include <napi.h>
#include <atomic>
#include <chrono>
#include <memory>
#include <thread>

class Interval {
 public:
  Interval(Napi::Env env, Napi::Function callback, int interval)
      : running(true) {
    tsfn =
        Napi::ThreadSafeFunction::New(env, callback, "IntervalCallback", 0, 1);

    thread = std::thread([this, interval]() {
      while (running.load()) {
        std::this_thread::sleep_for(std::chrono::milliseconds(interval));

        if (!running.load()) {
          break;
        }

        auto status =
            tsfn.NonBlockingCall([](Napi::Env env, Napi::Function jsCallback) {
              jsCallback.Call({});
            });

        if (status != napi_ok) {
          break;
        }
      }

      tsfn.Release();
    });
  }

  ~Interval() {
    Stop();
  }

  void Stop() {
    bool expected = true;

    if (running.compare_exchange_strong(expected, false)) {
      tsfn.Abort();

      if (thread.joinable()) {
        thread.join();
      }
    }
  }

 private:
  std::atomic<bool> running;
  std::thread thread;
  Napi::ThreadSafeFunction tsfn;
};

class IntervalWrap : public Napi::ObjectWrap<IntervalWrap> {
 public:
  static Napi::FunctionReference constructor;

  IntervalWrap(const Napi::CallbackInfo& info)
      : Napi::ObjectWrap<IntervalWrap>(info) {}

  Napi::Value Clear(const Napi::CallbackInfo& info) {
    if (interval) {
      interval->Stop();
    }

    return info.Env().Undefined();
  }

  static void Init(Napi::Env env) {
    auto ctor = DefineClass(
        env, "Interval", {InstanceMethod("clear", &IntervalWrap::Clear)});

    constructor = Napi::Persistent(ctor);
  }

  void Start(Napi::Env env, Napi::Function callback, int milliseconds) {
    interval = std::make_shared<Interval>(env, callback, milliseconds);
  }

 private:
  std::shared_ptr<Interval> interval;
};

Napi::Value SetInterval(const Napi::CallbackInfo& info) {
  auto env = info.Env();

  auto instance =
      IntervalWrap::constructor.New({Napi::Buffer<unsigned char>::New(env, 0)});
  auto wrap = Napi::ObjectWrap<IntervalWrap>::Unwrap(instance);

  wrap->Start(
      env,
      info[0].As<Napi::Function>(),
      info[1].As<Napi::Number>().Int32Value());

  return instance;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
      Napi::String::New(env, "setInterval"),
      Napi::Function::New(env, SetInterval));

  return exports;
}

NODE_API_MODULE(cpp_addon, Init)