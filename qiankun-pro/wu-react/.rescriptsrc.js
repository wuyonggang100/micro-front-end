module.exports = {
  webpack(config) {
    config.output.library = "wu-react";
    config.output.libraryTarget = "umd";
    config.output.publicPath = "//localhost:4001";
  },
  devServer: (config) => {
    config.headers = {
      "Access-Control-Allow-Origin": "*", // 允许跨域
    };
  },
};
