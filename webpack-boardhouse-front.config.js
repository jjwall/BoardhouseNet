const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    entry: './src/front/boardhouse/main.ts',
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
        new CopyWebpackPlugin([
            { from: './views/game.html', to: './../'},
            { from: './views/style.css', to: './../'},
            { from: './data', to: './../data' },
            { from: './node_modules/three/build/three.min.js' }
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'boardhouse-front.bundle.js',
        path: path.resolve(__dirname, 'dist/views/scripts')
    },
    externals: {
        three: 'THREE',
    },
};