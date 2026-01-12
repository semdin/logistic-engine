#define NODE_GYP_MODULE_NAME logistic_addon

#include <napi.h>

//sum function

Napi::Value Sum(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    if(info.Length() < 2){
        Napi::Error::New(env, "Two arguments expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    if(!info[0].IsNumber() || !info[1].IsNumber()){
        Napi::Error::New(env, "Arguments must be numbers").ThrowAsJavaScriptException();
        return env.Null();
    }
    double num1 = info[0].As<Napi::Number>().DoubleValue();
    double num2 = info[1].As<Napi::Number>().DoubleValue();
    return Napi::Number::New(env, num1 + num2);
}

// Expose Napi functions
Napi::Object Init(Napi::Env env, Napi::Object exports){
    exports.Set(Napi::String::New(env, "calculate"), Napi::Function::New(env, Sum));
    return exports;
}

NODE_API_MODULE(logistic_addon, Init)