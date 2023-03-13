const path = require('path');

module.exports = {
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, '..', 'tabs.ext.v1', 'popup'),
        filename: 'core.js',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js(x)*)?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["solid"]
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(sc|c)ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['*', '.js', '.jsx', '.scss', '.css'],
    },
}