const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: './src/back/engine/main.ts',
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
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'boardhouse-back.bundle.js',
        path: path.resolve(__dirname, '../dist/engine')
    },
    externals: [nodeExternals()],
};