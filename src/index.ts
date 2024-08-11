import minimist from 'minimist';
import { select, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import { runCommand } from "./utils";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path"
import { set } from "lodash";

type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

type ChoiceOption = Choice<string> | string;

interface CommandOption {
    framework?: string;
    language: string;
    lints: string[];
}

const argv = minimist<{
    template?: string
    help?: boolean
}>(process.argv.slice(2), {
    default: { help: false },
    alias: { h: 'help', t: 'template' },
    string: ['_'],
});

const cwd = process.cwd();
const colorList = [chalk.cyan, chalk.green, chalk.blueBright, chalk.greenBright, chalk.redBright, chalk.magenta, chalk.reset, chalk.yellow, chalk.magenta];
const languageList = [{
    name: 'javascript',
    value: 'js'
}, {
    name: 'typescript',
    value: 'ts'
}];
const frameworkList: ChoiceOption[] = [{
    name: 'none',
    value: undefined,
    description: 'npm packages that don\'t require a framework'
}, 'react', 'vue'];
const lintList: ChoiceOption[] = ['commitlint', 'eslint', 'lint-staged', 'prettier', 'stylelint'];
const pkgPath = resolve(cwd, 'package.json');

function genChoices(options: ChoiceOption[]) {
    return options.map((option, index) => {
        let tempOption: Choice<string>;
        if (typeof option === 'string') {
            tempOption = {
                name: option,
                value: option,
            };
        } else {
            tempOption = option;
        }
        return {
            ...tempOption,
            name: colorList[index%colorList.length](tempOption.name),
        }
    })
}

async function installHusky() {
    await runCommand('pnpm install husky');
    const pkgContent = readFileSync(pkgPath, 'utf8');
    const pkgObj = JSON.parse(pkgContent);
    set(pkgObj, "scripts.prepare", "husky init");
    const newPkgContent = JSON.stringify(pkgObj, null, 2);
    writeFileSync(pkgPath, newPkgContent, 'utf-8');
}

function genEslintConfig(config: CommandOption) {
    const fileNames: string[] = [];
    fileNames.push(config.language);
    if (config.framework) fileNames.push(config.framework);
    if (config.lints.includes('prettier')) fileNames.push('prettier');
    const configFileName = fileNames.join('-') + '.js';
    const configContent = readFileSync(resolve(__dirname, `../templates/eslint/${configFileName}`), 'utf8');
    writeFileSync(resolve(cwd, 'eslint.config.js'), configContent, 'utf-8');
}

async function init() {
    const language = await select({
        message: 'Select a language:',
        default: 'js',
        choices: genChoices(languageList),
    })
    const framework = await select({
        message: 'Select a framework:',
        default: undefined,
        choices: genChoices(frameworkList),
    });
    const lints = await checkbox({
        message: 'Select tools you need:',
        choices: genChoices(lintList),
    });
    const config: CommandOption = {
        language,
        framework,
        lints,
    }

    const needEslint = lints.includes('eslint');
    if (needEslint) genEslintConfig(config);

    const needHusky = lints.some(lint => ['commitlint', 'lint-staged'].includes(lint));
    if (needHusky) await installHusky();
}

init().catch((err) => {
    console.error(err);
});
