const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'pmColor.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};