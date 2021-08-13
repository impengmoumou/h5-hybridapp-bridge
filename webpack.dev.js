const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: { test: path.resolve(__dirname, "./test/index.jsx") },
  output: {
    filename: "js/[name].[hash:8].js",
    path: path.resolve(__dirname, "./dist/"),
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "html-withimg-loader",
      },
    ],
  },
  devServer: {
    hot: true,
    host: "10.1.116.22",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./test/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[id].[hash:8].css",
    }),
    new HotModuleReplacementPlugin(),
  ],
};
