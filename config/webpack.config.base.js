const webpack = require('webpack');
const path = require('path');

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '/';

const config = {
    mode: 'production',

    context: path.resolve(__dirname, '../src'),

    entry: {
        app: ['./app.js'],
    },

    output: {
        filename: '[name].js',
        pathinfo: true,
        path: path.resolve(__dirname, '../dist/'),
        publicPath: ASSET_PATH
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['env'] }
                }]
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            },
            {
                test: /src\/.*\.(html)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: /assets\/.*\.(css|CSS|jpe?g|JPE?G|gif|GIF|png|PNG|svg|SVG|woff|WOFF|ttf|TTF|wav|WAV|mp3|MP3|html|HTML|ico|ICO|txt|TXT|json|JSON)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ 'CANVAS_RENDERER': JSON.stringify(true), 'WEBGL_RENDERER': JSON.stringify(true) })
    ],

    resolve: {
        fallback: {
            fs: false,
            net: false,
            tls: false
        }
    }
};

module.exports = config;
