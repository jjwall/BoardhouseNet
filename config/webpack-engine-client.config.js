const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    entry: './src/client/engine/main.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
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
        })
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