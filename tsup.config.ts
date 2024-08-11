import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'], // 指定入口文件路径
    sourcemap: false, // 生成sourcemap文件以便于调试
    clean: true, // 在打包之前清空dist目录
});
