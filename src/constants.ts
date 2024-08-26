const LintConfig = {
    eslint: {
        output: 'eslint.config.js',
        template() {
            return 'eslint.config.js';
        },
        dependencies() {
            return ['eslint@8', 'eslint-config'];
        }
    },
    prettier: {

    },
    commitlint: {
        output: 'stylelint.config.js'
    },
    styleLint: {
        output: 'stylelint.config.js'
    }
}