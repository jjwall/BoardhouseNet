const path = require('path');

module.exports = {
    entry: './src/back/boardhouse/main.ts',
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
        path: path.resolve(__dirname, 'dist/engine')
    },
};