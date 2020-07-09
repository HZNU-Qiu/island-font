'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const port = 9528 // dev port

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/v1': {
                ws: false,
                // target: 'http://120.27.247.78:3000/ ',
                target: 'http://127.0.0.1:3000/',
                changeOrigin: true
            }
        },
    },
    configureWebpack: config => {
        if (debug) {
            config.devtool = 'source-map'
        }
    }
}