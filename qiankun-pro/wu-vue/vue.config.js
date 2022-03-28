module.exports = {
  publicPath: "//localhost:8081", // 保证静态资源都从 8081 端口获取
  devServer: {
    port: 8081,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      libraryTarget: "umd", //使用 umd 方式打包，变量都挂载到 window 上
      library: "wu-vue", // 挂载到 wndow 上的变量名
    },
  },
};
