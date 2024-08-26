export type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

export type ChoiceOption = Choice<string> | string;

export interface CommandOption {
    framework?: string;
    language: string;
    lints: string[];
}