import * as chalk from 'chalk';
import spawn from 'cross-spawn';
import { readFileSync, writeFileSync } from 'node:fs';
import { set } from 'lodash';
import { Command } from './types';

export async function runCommand(command: string, args: string[] = []): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const child = spawn(command, [...args, '--color']);
        child.stdout.on('data', (data) => {
            console.log(String(data));
        });
        child.stderr.on('data', (data) => {
            reject(chalk.red(`${data}`));
            reject(false);
        });
        child.on('close', () => {
            resolve(true);
        });
    });
}

export async function addCommand(pkgPath: string, command: Command[] | Command) {
    const commands = Array.isArray(command) ? command : [command];
    const pkgContent = readFileSync(pkgPath, 'utf8');
    const pkgObj = JSON.parse(pkgContent);
    for (const cmd of commands) set(pkgObj, `scripts.${cmd.name}`, cmd.value);
    const newPkgContent = JSON.stringify(pkgObj, null, 2);
    writeFileSync(pkgPath, newPkgContent, 'utf-8');
}

export async function addGitHook(pkgPath: string, command: string) {
    const content = `
    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    ${command}`;
    writeFileSync(pkgPath, content, 'utf-8');
}
