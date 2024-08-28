export type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

export type ChoiceOption = Choice<string> | string;

export interface CommandContext {
    cwd: string;
    framework?: string;
    language: string;
    lints: string[];
    need?: {
        eslint?: boolean;
        prettier?: boolean;
        commitLint?: boolean;
        styleLint?: boolean;
        husky?: boolean;
    };
}

export interface Command {
    name: string;
    value: string;
}
