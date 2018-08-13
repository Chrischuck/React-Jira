const path = require( "path" );

module.exports = {
    mode: 'development',
    context: path.join( __dirname, "src" ),
    entry: {
        app: "./client/index.js",
    },
    resolve: {
        modules: [
            path.resolve( "./src" ),
            "node_modules",
        ],
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
        ],
    },
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "[name].bundle.js",
    },
};