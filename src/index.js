const fs = require("fs");
const diskName = process.env.SystemDrive;
const userName = process.env.USERNAME;

try {
  createFileExtensionInstallCommand();
  createFileSettingsJSON();
} catch (e) {
  console.log(e);
  promptPressAnyKeyToExit();
}

function createFileExtensionInstallCommand() {
  const extensionsDirFullPath = `${diskName}\\Users\\${userName}\\.vscode\\extensions\\`;
  const extensionInstallCommandList = [];

  if (fs.existsSync(extensionsDirFullPath) === false) {
    throw `Can't find extensions dir: ${extensionsDirFullPath}`;
  }

  fs.readdirSync(extensionsDirFullPath).forEach((file) => {
    const extensionName = file.slice(0, file.lastIndexOf("-"));
    extensionInstallCommandList.push(`code --install-extension ${extensionName}\n`);
  });

  fs.writeFileSync("./extensions_install_command.txt", "");
  extensionInstallCommandList.forEach((command) => {
    fs.writeFileSync("./extensions_install_command.txt", command, { flag: "a+" });
  });
}

function createFileSettingsJSON() {
  const fullPath = `${diskName}\\Users\\${userName}\\AppData\\Roaming\\Code\\User\\settings.json`;
  if (fs.existsSync(fullPath) === false) {
    throw `Can't find settings.json: ${fullPath}`;
  }
  fs.copyFileSync(fullPath, "./settings.json");
}

function promptPressAnyKeyToExit() {
  console.log("Press enter key to exit");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", () => {
    process.exit(-1);
  });
}
