const path = require("path");
//Подключение плагинов
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";

const optimization = () => {
  const config = {
    // splitChunks: {
    //     chunks: "all",
    //   },
  };
  if (!isDev) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development", // при продакшен сборке файл bundle.js минимифицирован
  entry: {
    //входной файл приложения
    main: "./index.js",
    //дополнительные скрипты
    // analytics: "./src/analytics.js"
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json"], //если лень писать расширения при импорте
    alias: {
      "@": path.resolve(__dirname, "src"), //указывать пути через элиос (может быть много @components)
    },
  },
  // optimisation: {
  //
  // },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      mitify: {
        collapseWhitespace: !isDev,
      },
    }),
    new CleanWebpackPlugin(),
    //Плагин для вставки вайлов в из одной папки в другую
    // new CopyWebpackPlugin([
    //   {
    //     from:"",
    //     to:
    //   }
    // ]),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          "css-loader",
        ],
      },
      { test: /\.(png|jpg|svg|gif)$/, use: ["file-loader"] },
      { test: /\.(ttf|woff|woff2|eot)$/, use: ["file-loader"] },
    ],
  },
};
