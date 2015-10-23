var path = require('path'),
    webpack = require('webpack'),
    jsDir = path.resolve(__dirname, 'js'),
    imageDir = path.resolve(__dirname, 'images'),
    nodeModulesDir = path.resolve(__dirname, '../', 'node_modules');

module.exports = {
    entry: path.resolve(jsDir, 'material_qna.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        module: {
            noParse: /autoit\.js$/
        },
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                    'ng-annotate?add=true',
                    'babel?optional[]=runtime'
                ],
                include: [jsDir]
            },
            {
                test: /\.jade$/,
                loader: 'jade',
                include: [path.resolve(__dirname, 'templates')]
            },
            {
                test: /\.png$/,
                loader: 'file',
                include: [imageDir]
            },
            {
                test: /\.ico$/,
                loader: 'file?name=[name].[ext]',
                include: [imageDir]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                include: [
                    path.resolve(__dirname, 'css'),
                    path.resolve(nodeModulesDir, 'angular-material'),
                    path.resolve(nodeModulesDir, 'angular-material-data-table', 'dist'),
                    path.resolve(nodeModulesDir, 'highlight.js', 'styles')
                ]
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jade', '.png', '.ico', '.css']
    }
};