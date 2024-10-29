const path = require("path");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (_env, options) => {
  const devMode = options.mode !== "production";

  return {
    optimization: {
      minimizer: [new CssMinimizerPlugin({}), new TerserPlugin({})],
    },
    // not perfect, emits some extra modules (e.g. styles.js), but it works
    // everything hot-reloads in development mode properly, the correct
    // filepaths are set in the html eex layout file
    entry: {
      app: glob
        .sync("./vendor/**/*.js")
        .concat(["./js/app.js", "./frontend/react.js"]),
      styles: ["./css/styles.scss", "./css/reset.css"],
    },
    output: {
      // filename: '[name].js',
      filename: (pathData) => {
        // console.log(pathData);
        return pathData.chunk.id == "styles" ? "[name].css" : "[name].js";
      },
      path: path.resolve(__dirname, "../priv/static/bundle/"),
    },
    devtool: devMode ? "eval-cheap-module-source-map" : false,
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
            {
              loader: "ts-loader",
            },
          ],
        },
        {
          test: /\.[s]?css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".jsx", ".css", ".scss"],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "../bundle/bundle.css" }),
      new CopyWebpackPlugin({ patterns: [{ from: "static/", to: "../" }] }),
    ],
  };
};
