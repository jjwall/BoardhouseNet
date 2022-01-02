const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    target: 'node',
    entry: './src/gameserver/serverengine/main.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ]
            }
        ]
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'game-server.bundle.js',
        path: path.resolve(__dirname, '../dist/server')
    },
    externals: [nodeExternals()],
};