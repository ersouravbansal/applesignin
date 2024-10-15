const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry:"./src/profit/login-profit.js",
    output:{
        path: path.resolve(__dirname,"dist"),
        filename:"stage-login.js"
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
                'USER_POOL_ID': JSON.stringify('ap-south-1_YG6n1KIyr'),
                'REGION': JSON.stringify('ap-south-1'),
                'CLIENT_ID': JSON.stringify('4tpolhctpesvk7j07voobnipki'),
                /*'CONFIG_URL': JSON.stringify('http://localhost/login-git/login/login-newdesign/'),
                'SIGN_IN_URL': JSON.stringify('http://localhost/login-git/login/login-newdesign/sso.html'),
                'SIGN_OUT_URL': JSON.stringify('http://localhost/login-git/login/login-newdesign/sso.html?logout=1'),*/
                'CONFIG_URL': JSON.stringify('https://stage-auth.ndtv.com/w/'),
                'SIGN_IN_URL': JSON.stringify('https://stage-auth.ndtv.com/w/sso.html'),
                'SIGN_OUT_URL': JSON.stringify('https://stage-auth.ndtv.com/w/sso.html?logout=1'),
                'API_LOGIN_URL': JSON.stringify('https://auth.ndtv.com/api/login'),
                'IMAGE_URL': JSON.stringify('https://stage-auth.ndtv.com/w/images/'),
                'AWS_COGNITO_URL': JSON.stringify('https://sso-stage.ndtv.com'),
                'AWS_COGNITO_DOMAIN': JSON.stringify('sso-stage.ndtv.com'),
                'REDIRECT_FILE_NAME': JSON.stringify('sso.html'),
                'DOMAIN': JSON.stringify('ndtv.com'),
                'SHOW_LOG': JSON.stringify('true'),
                'CSS_URL': JSON.stringify('https://s-cdn.ndtv.com/login-css/'),  
                'GOOGLE_CLIENT_ID': JSON.stringify('955390692103-buqprh878v4b820j9042rj8jqm3h10f8.apps.googleusercontent.com')
            }

        }),
    ],
}