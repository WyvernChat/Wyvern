const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

// @ts-check

module.exports = /** @type {import("webpack").Configuration} */ ({
    entry: "./src/index.prod.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "webpack.bundle.js",
        libraryTarget: "var",
        library: "Bundle",
        publicPath: "/"
    },
    mode: "production",
    devServer: {
        allowedHosts: ["wyvern.tkdkid1000.net"],
        bonjour: true,
        compress: true,
        proxy: {
            "/": "https://wyvern.tkdkid1000.net"
        },
        port: 3001,
        host: "localhost",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.json"
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                loader: "file-loader"
            }
        ]
    },
    resolve: {
        alias: {},
        extensions: ["", ".js", ".ts", ".tsx", ".css", ".scss", ".png", ".svg"],
        modules: ["node_modules"]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "img",
                    to: "img"
                },
                {
                    from: "_redirects",
                    to: "_redirects"
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: "index.html",
            inject: true,
            favicon: "img/favicon.png"
        })
    ]
})
