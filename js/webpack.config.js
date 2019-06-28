const path = require('path')

const __extension__  = 'jupyter-nbrequirements'
const __module__     = 'nbrequirements'

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	output: {
		library: __module__,
		filename: 'extension.js',
		path: path.resolve(__dirname, '..', __extension__, 'static'),
		libraryTarget: 'amd',
		umdNamedDefine: true
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	externals: {
		'base/js/events': { amd: 'base/js/events'},
		'base/js/namespace': { amd: 'base/js/namespace'},
		'notebook/js/notebook': { amd: 'notebook/js/notebook'},
		underscore: { amd: 'underscore'},
	},
}
