const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    filename: "core.min.js",
    path: path.resolve(__dirname),
    library: "h5-hybridapp-bridge",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};
