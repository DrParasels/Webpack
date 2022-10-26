const path = require("path");
//Подключение плагинов
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
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

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    },
    "css-loader",
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const plugins = () => {
  const base = [
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
      filename: filename("css"),
    }),
  ];

  if (!isDev) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development", // при продакшен сборке файл bundle.js минимифицирован
  entry: {
    //входной файл приложения
    main: ["@babel/polyfill", "./index.js"],
    //дополнительные скрипты
    // analytics: "./src/analytics.js"
  },
  output: {
    filename: filename("js"),
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
  // devtool: isDev ? "source-map" : "",
  plugins: plugins(),
  module: {
    rules: [
      { test: /\.(png|jpg|svg|gif)$/, use: ["file-loader"] },
      { test: /\.(ttf|woff|woff2|eot)$/, use: ["file-loader"] },
      { test: /\.css$/, use: cssLoaders() },
      { test: /\.s[ac]ss$/, use: cssLoaders("sass-loader") },
      { test: /\.less$/, use: cssLoaders("less-loader") },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
};
