import minimist from 'minimist';
import { select, checkbox } from '@inquirer/prompts';
import * as chalk from 'chalk';
import { addCommand, runCommand } from './utils';
import { resolve } from 'node:path';
import { ChoiceOption, CommandContext, Choice } from './types';
import { LintConfig } from './constants';

const argv = minimist<{
    template?: string;
    help?: boolean;
}>(process.argv.slice(2), {
    default: { help: false },
    alias: { h: 'help', t: 'template' },
    string: ['_'],
});

const cwd = process.cwd();
const colorList = [
    chalk.cyan,
    chalk.green,
    chalk.blueBright,
    chalk.greenBright,
    chalk.redBright,
    chalk.magenta,
    chalk.reset,
    chalk.yellow,
    chalk.magenta,
];
const languageList = [
    {
        name: 'javascript',
        value: 'js',
    },
    {
        name: 'typescript',
        value: 'ts',
    },
];
const frameworkList: ChoiceOption[] = [
    {
        name: 'None of these',
        value: undefined,
        description: "npm packages that don't require a framework",
    },
    'react',
    'vue',
];
const lintList: ChoiceOption[] = ['commitlint', 'eslint', 'lint-staged', 'prettier', 'stylelint'];
const styleList: ChoiceOption[] = ['css', 'scss', 'less'];
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
            name: colorList[index % colorList.length](tempOption.name),
        };
    });
}

async function installHusky() {
    await runCommand('pnpm install husky');
    await addCommand(pkgPath, { name: 'prepare', value: 'husky init' });
}

async function initFile(context: CommandContext): Promise<string[]> {
    const needDeps: string[] = [];
    if (context.need.eslint) {
        LintConfig.eslint.init(context);
        needDeps.push(...LintConfig.eslint.dependencies(context));
    }
    if (context.need.prettier) {
        LintConfig.prettier.init(context);
        needDeps.push(...LintConfig.prettier.dependencies(context));
    }
    if (context.need.commitLint) {
        LintConfig.commitLint.init(context);
        needDeps.push(...LintConfig.commitLint.dependencies(context));
    }
    if (context.need.styleLint) {
        LintConfig.styleLint.init(context);
        needDeps.push(...LintConfig.styleLint.dependencies(context));
    }
    return needDeps;
}

async function init() {
    const language = await select({
        message: 'Select a language:',
        default: 'js',
        choices: genChoices(languageList),
    });
    const framework = await select({
        message: 'Select a framework:',
        default: undefined,
        choices: genChoices(frameworkList),
    });
    const lints = await checkbox({
        message: 'Select tools you need:',
        choices: genChoices(lintList),
    });
    let style = 'css';
    const context: CommandContext = {
        cwd,
        language,
        framework,
        lints,
        need: {
            eslint: lints.includes('eslint'),
            prettier: lints.includes('prettier'),
            husky: lints.some((lint) => ['commitlint', 'lint-staged'].includes(lint)),
            commitLint: lints.includes('commitlint'),
            styleLint: lints.includes('styleLint'),
        },
    };
    if (context.need.styleLint) {
        style = await checkbox({
            message: 'Select tools you need:',
            choices: genChoices(styleList),
        });
    }

    if (context.need.husky) await installHusky();
    const dependencies = await initFile(context);

    console.log(`You need install this deps ${dependencies}`);
}

init().catch((err) => {
    console.error(err);
});
