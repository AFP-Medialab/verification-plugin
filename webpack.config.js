const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    popup: "./src/index.jsx",
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
        //include: path.resolve(__dirname, 'src'),
        exclude: "/node/node_modules",
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
        //include: path.resolve(__dirname, 'src'),
        exclude: "/node_modules/",
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|tsv)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
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
    }),
    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new Dotenv(),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["node_modules", "src"],
  },
  experiments: {
    asyncWebAssembly: true,
  }
};
