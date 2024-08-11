module.exports = {
    // 继承推荐规范配置
    extends: [
        'stylelint-config-standard',
        'stylelint-config-prettier',
        'stylelint-config-recommended-scss',
    ],
    plugins: ['stylelint-order'],
    // 不同格式的文件指定自定义语法
    overrides: [
        {
            files: ['**/*.(scss|css|vue|html)'],
            customSyntax: 'postcss-scss',
        },
        {
            files: ['**/*.(html|vue)'],
            customSyntax: 'postcss-html',
        },
    ],
    // 忽略检测文件
    ignoreFiles: [
        '**/*.js',
        '**/*.jsx',
        '**/*.tsx',
        '**/*.ts',
        '**/*.json',
        '**/*.md',
        '**/*.yaml',
    ],
    // 自定义配置规则
    rules: {
        // 便于配置变量 关闭未知属性检测
        'property-no-unknown': null,
        // 指定类选择器的模式
        'selector-class-pattern': null,
        // 允许 Vue 的 global
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global'],
            },
        ],
        // 允许 Vue 的 v-deep
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['v-deep'],
            },
        ],
        // 允许对应内核前缀
        'property-no-vendor-prefix': null,
    },
};
