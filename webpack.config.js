// include path library
const path = require("path");
// importing mini-css-extract-plugin package
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// add the Eslint plugin
const ESLintPlugin = require('eslint-webpack-plugin');

// add html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Dynamically configure mode state
let mode = "development";

/*
Because JavaScript can be written for both server and browser,
webpack offers multiple deployment targets that you can set in
your webpack configuration.

target: web -> Compile for usage in a browser-like environment (default)
*/
// let target = "web";

// if (process.env.NODE_ENV === "production"){
// 	mode = "production";
// 	target = "browserslist";
// }

module.exports = {
	mode: mode,

	// target: target,

  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
	// They are used to display your original JavaScript while debugging,
	// which is a lot easier to look at than minified production code.
	devtool: "source-map",
	
	// “entry”, which will be the root of our dependencies graph.
	entry: "./src/js/index.js",

	// Plugins
	plugins: [
    new MiniCssExtractPlugin({filename: 'css/main.css'}),
    new ESLintPlugin({extensions: ['ts', 'js', 'jsx']}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/templates/index.ejs'),
      filename: path.resolve(__dirname, './blogapp/templates/blogapp/frontend_base.html'),
      inject: false,
    }),
  ],

	// the output configuration options tells webpack how to write the compiled files to disk
	output: {
		path: path.resolve(__dirname, "./blogapp/static/blogapp/"),
		filename: "js/[name].bundle.js",
    /*
      Custom output directory and filename for images.
      blogapp/static/blogapp/images/
    */
		assetModuleFilename: "images/[hash][ext][query]",
		/*
			Without using clean-webpack-plugin.
			Cleans the /dist folder before each build, so that only used
			files will be generated.
		*/
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				// Initializing babel-loader for older browser compatability
				use: ['babel-loader'],
			},
      
      /*
       * Image Management Rule
      */
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },

			{
				// RegEx exp. to support sass/scss/css files.
				test: /\.(s[ac]|c)ss$/i,
				use: [
          MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
          "postcss-loader",
				]
			},
		]
  },

	devServer: {
		static: "./blogapp/static/blogapp/",
		// enable hot-reloading
		hot: true,
    // points to django-server
    // You will not need to change anything in django, also no need for django-webpack-loader
    // django javascript python webpack webpack-dev-server
		proxy: {
			'!./static/blogapp/**':{
				target: "http://localhost:8000",
				changeOrigin: true,
			},
		},
	}
};
