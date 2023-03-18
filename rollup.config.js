const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
module.exports = [
  {
    //入口文件
    input: 'packages/vue/src/index.ts',
    //出口文件
    output: [
      //导出iife模式
      {
        //开启sourcemap
        sourcemap: true,
        file: './packages/vue/dist/vue.js',
        // 包格式
        format: 'iife',
        // 变量名
        name: 'Vue',
      },
    ],
    // 插件
    plugins: [
      typescript({
        sourceMap: true,
      }),
      // 模块导入的路径补全
      resolve(),
      // 转commonjs为esm
      commonjs(),
    ],
  },
]
