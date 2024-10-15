const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry:"./src/profit/login-profit.js",
    watch: true,
    output:{
        path: path.resolve(__dirname,"dist"),
        filename:"stage-login-profit.js"
    },
    externals: {
        jquery: 'jQuery',
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENVIROMENT': JSON.stringify('development'),
                
                'API_LOGIN_URL': JSON.stringify('https://auth.ndtv.com/api/login'),
                'IMAGE_URL': JSON.stringify('https://stage-auth.ndtv.com/w/images/'),
                'AWS_COGNITO_URL': JSON.stringify('https://sso-stage.ndtv.com'),
                'AWS_COGNITO_DOMAIN': JSON.stringify('sso-stage.ndtv.com'),
                'REDIRECT_FILE_NAME': JSON.stringify('sso.html'),
                'DOMAIN': JSON.stringify('ndtv.com'),
                'SHOW_LOG': JSON.stringify('true'),
                'CSS_URL': JSON.stringify('https://s-cdn.ndtv.com/login-css/'),  
                'GOOGLE_CLIENT_ID': JSON.stringify('955390692103-buqprh878v4b820j9042rj8jqm3h10f8.apps.googleusercontent.com'),

                'PROFIT_AUTH_KEY': JSON.stringify('http://localhost:4001'),
                'AUTH_CLIENT_KEY': JSON.stringify('ad481d08-349a-4295-b6af-9ca9300d83f0'),
                'AUTH_SECRET_KEY': JSON.stringify('$2a$10$ubyHy2lD7BJq8A3Oo.2nxOo.x3S6QWKbXaBAdsUn88KZa/KM5475O')
            }

        }),
    ],
}