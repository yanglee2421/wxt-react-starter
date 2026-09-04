const platform = process.platform;

if (platform === "win32") {
  console.log("./src/main_win.cpp");
} else if (platform === "darwin") {
  console.log("./src/main_macos.cpp");
} else {
  console.log("./src/main_linux.cpp");
}
