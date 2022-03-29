const packageName = require("./package.json").name;
const outputCfg = {
  library: packageName,
  libraryTarget: "umd",
  publicPath: "//localhost:4001/", // 末尾的 / 不能少
};

module.exports = {
  webpack(config) {
    console.log("我config运行了");
    config.output = { ...config.output, ...outputCfg };
    return config;
  },
  devServer: (config) => {
    console.log("我devserver运行了");
    config.headers = {
      "Access-Control-Allow-Origin": "*", // 允许跨域
    };
    return config;
  },
};
