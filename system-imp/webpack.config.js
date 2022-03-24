const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = (env) => {
  return {
    mode: "development",
    output: "index.js",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: env.production ? "system" : "", // 生产时遵循 system 模块规范来打包， ”“ 会打包成自执行函数
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: { loader: "babel-loader" },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: env.production
      ? []
      : [
          // 仅开发时使用，生产时打包成模块使用
          new HtmlWebpackPlugin({
            template: "./public/index.html",
          }),
        ],
    externals: env.production ? ["react", "react-dom"] : [], // 生产时忽略打包
  };
};
