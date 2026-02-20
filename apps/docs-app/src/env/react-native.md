# React Native

- First download [Android Studio](https://developer.android.google.cn/studio?hl=zh-cn) in windows
- Unzip it to `%ANDROID_HOME%\cmdline-tools\latest`

[Android Studio Command Line Tools](https://developer.android.google.cn/studio?hl=zh-cn)

## Installation

```powershell
# Run as admin
# Install chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install JDK
choco install -y microsoft-openjdk17

# Add Env ANDROID_HOME
# Add Path %ANDROID_HOME%\cmdline-tools\latest\bin
# Install Android SDK
sdkmanager "platform-tools" "build-tools;34.0.0"

# Install Emulator
sdkmanager "emulator" "platforms;android-34" "system-images;android-34;google_apis;x86_64"
avdmanager create avd -n emulatorName -k "system-images;android-34;google_apis;x86_64" -d "pixel"
```

# Build

[Expo Documation](https://docs.expo.dev/guides/local-app-production/)

```powershell
# Generate native dir by Expo prebuild
expo prebuild
cd ./android

# For .aab
./gradlew app:bundleRelease
# For .apk
./gradlew app:assembleRelease
# Or build with expo
expo run:android --variant release
```
