const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
  entry: {
    popup: "./src/index.jsx",
    inject:"./src/background/inject.js",
    background: "./src/background/index.jsx",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    iife: false,
  },
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|tsv)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg$/i,
        type: "asset",
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/popup.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      filename: "background.html",
      chunks: ["background"],
    }),
    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new Dotenv(),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["node_modules", "src"],
    fallback: {
      buffer: require.resolve("buffer"),
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@workers": path.resolve(__dirname, "src/workers"),
      "@Shared": path.resolve(__dirname, "src/components/Shared"),
    },
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
