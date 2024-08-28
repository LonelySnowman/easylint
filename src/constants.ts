import { CommandContext } from './types';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { addGitHook } from './utils';

export const LintConfig = {
    eslint: {
        output: 'eslint.config.js',
        init(context: CommandContext) {
            const fileNames: string[] = [context.language];
            if (context.framework) fileNames.push(context.framework);
            if (context.need.prettier) fileNames.push('prettier');
            const configFileName = fileNames.join('-') + '.js';
            const templateFile = resolve(__dirname, `../templates/eslint/${configFileName}`);
            const outputFile = resolve(context.cwd, 'eslint.config.js');
            copyFileSync(templateFile, outputFile);
        },
        dependencies(context: CommandContext) {
            const deps = ['eslint', '@eslint/js', 'globals'];
            if (context.language === 'ts') deps.push('typescript-eslint');
            if (context.framework === 'react') deps.push('eslint-plugin-react');
            if (context.framework === 'vue') deps.push('eslint-plugin-vue');
            if (context.need.prettier) deps.push('eslint-plugin-prettier', 'eslint-plugin-prettier');
            return deps;
        },
    },
    prettier: {
        output: 'prettier.config.js',
        init(context: CommandContext) {
            const templateFile = resolve(__dirname, `../templates/prettier/index.js`);
            const outputFile = resolve(context.cwd, 'prettier.config.js');
            copyFileSync(templateFile, outputFile);
        },
        dependencies(context: CommandContext) {
            return ['prettier'];
        },
    },
    commitLint: {
        output: 'commitlint.config.js',
        init(context: CommandContext) {
            const templateFile = resolve(__dirname, `../templates/commitlint/index.js`);
            const hookFile = resolve(context.cwd, '.husky/commit-msg');
            const outputFile = resolve(context.cwd, 'commitlint.config.js');
            copyFileSync(templateFile, outputFile);
            addGitHook(hookFile, 'npx --no-install commitlint --edit');
        },
        dependencies(context: CommandContext) {
            return ['@commitlint/config-conventional'];
        },
    },
    styleLint: {
        output: 'stylelint.config.js',
        init(context: CommandContext) {
            return 'eslint.config.js';
        },
        dependencies(context: CommandContext) {
            return ['eslint@8', 'eslint-config'];
        },
    },
    lintStaged: {
        output: 'prettier.config.js',
        init(context: CommandContext) {
            return 'eslint.config.js';
        },
        dependencies(context: CommandContext) {
            return ['eslint@8', 'eslint-config'];
        },
    },
};
