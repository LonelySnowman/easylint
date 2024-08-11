import chalk from "chalk";
import spawn from "cross-spawn";

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
        })
    })
}
