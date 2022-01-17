const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    target: 'web',
    entry: './src/gameclient/clientengine/main.ts',
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
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './public/game.html', to: './../'},
                { from: './public/style.css', to: './../'},
                { from: './data', to: './../data' },
                { from: './node_modules/three/build/three.min.js' }
            ]
        }),
        new ForkTsCheckerWebpackPlugin()
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'game-client.bundle.js',
        path: path.resolve(__dirname, '../dist/public/scripts')
    },
    externals: {
        three: 'THREE',
    },
};