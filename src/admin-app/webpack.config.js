module.exports = {
    entry : "./index.js",
    output : {
        filename : "adminApp.js",
        path : __dirname + "/../server/public/javascripts/"
    },
    module : {
        rules : [
            {
                test: /\.(js|jsx)$/,
                exclude : /node_modules/,
                use : {
                    loader : "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: ['css-loader'],
            },
        ]
    }
};