const path = require('path');


module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			}
		]
	},
	resolve: {
	extensions: [ '.tsx', '.ts', '.js' ]
	},
	watch: true
}