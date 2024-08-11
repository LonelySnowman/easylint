var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_minimist = __toESM(require("minimist"));
var import_prompts = require("@inquirer/prompts");
var import_chalk2 = __toESM(require("chalk"));

// src/utils.ts
var import_chalk = __toESM(require("chalk"));
var import_cross_spawn = __toESM(require("cross-spawn"));
async function runCommand(command, args = []) {
  return new Promise((resolve2, reject) => {
    const child = (0, import_cross_spawn.default)(command, [...args, "--color"]);
    child.stdout.on("data", (data) => {
      console.log(String(data));
    });
    child.stderr.on("data", (data) => {
      reject(import_chalk.default.red(`${data}`));
      reject(false);
    });
    child.on("close", () => {
      resolve2(true);
    });
  });
}

// src/index.ts
var import_node_fs = require("fs");
var import_node_path = require("path");
var import_lodash = require("lodash");
var argv = (0, import_minimist.default)(process.argv.slice(2), {
  default: { help: false },
  alias: { h: "help", t: "template" },
  string: ["_"]
});
var cwd = process.cwd();
var colorList = [import_chalk2.default.cyan, import_chalk2.default.green, import_chalk2.default.blueBright, import_chalk2.default.greenBright, import_chalk2.default.redBright, import_chalk2.default.magenta, import_chalk2.default.reset, import_chalk2.default.yellow, import_chalk2.default.magenta];
var languageList = [{
  name: "javascript",
  value: "js"
}, {
  name: "typescript",
  value: "ts"
}];
var frameworkList = [{
  name: "none",
  value: void 0,
  description: "npm packages that don't require a framework"
}, "react", "vue"];
var lintList = ["commitlint", "eslint", "lint-staged", "prettier", "stylelint"];
var pkgPath = (0, import_node_path.resolve)(cwd, "package.json");
function genChoices(options) {
  return options.map((option, index) => {
    let tempOption;
    if (typeof option === "string") {
      tempOption = {
        name: option,
        value: option
      };
    } else {
      tempOption = option;
    }
    return {
      ...tempOption,
      name: colorList[index % colorList.length](tempOption.name)
    };
  });
}
async function installHusky() {
  await runCommand("pnpm install husky");
  const pkgContent = (0, import_node_fs.readFileSync)(pkgPath, "utf8");
  const pkgObj = JSON.parse(pkgContent);
  (0, import_lodash.set)(pkgObj, "scripts.prepare", "husky init");
  const newPkgContent = JSON.stringify(pkgObj, null, 2);
  (0, import_node_fs.writeFileSync)(pkgPath, newPkgContent, "utf-8");
}
function genEslintConfig(config) {
  console.log(config, "=======");
  const fileNames = [];
  fileNames.push(config.language);
  if (config.framework) fileNames.push(config.framework);
  if (config.lints.includes("prettier")) fileNames.push("prettier");
  const configFileName = fileNames.join("-") + ".js";
  const configContent = (0, import_node_fs.readFileSync)((0, import_node_path.resolve)(__dirname, `../templates/eslint/${configFileName}`), "utf8");
  (0, import_node_fs.writeFileSync)((0, import_node_path.resolve)(cwd, "eslint.config.js"), configContent, "utf-8");
}
async function init() {
  const language = await (0, import_prompts.select)({
    message: "Select a language:",
    default: "js",
    choices: genChoices(languageList)
  });
  const framework = await (0, import_prompts.select)({
    message: "Select a framework:",
    default: void 0,
    choices: genChoices(frameworkList)
  });
  const lints = await (0, import_prompts.checkbox)({
    message: "Select tools you need:",
    choices: genChoices(lintList)
  });
  const config = {
    language,
    framework,
    lints
  };
  const needEslint = lints.includes("eslint");
  if (needEslint) genEslintConfig(config);
  const needHusky = lints.some((lint) => ["commitlint", "lint-staged"].includes(lint));
  if (needHusky) await installHusky();
  console.log(framework, lints);
}
init().catch((err) => {
  console.error(err);
});
