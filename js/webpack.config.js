const path = require('path')

const __library__ = 'nbrequirements'
const __package__ = 'jupyter_nbrequirements'

module.exports = [
	{// Notebook extension loader
		entry: './src/extension.js',
		output: {
			filename: 'extension.js',
			path: path.resolve(__dirname, '..', __package__, 'static'),
			libraryTarget: 'amd',
		},
		resolve: {
			extensions: ['.js']
		},
	},
	{// Notebook extension bundle
		mode: 'development',
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
			filename: 'index.js',
			path: path.resolve(__dirname, '..', __package__, 'static'),
			libraryTarget: 'amd',
		},
		devtool: 'inline-source-map',
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.json']
		},
		externals: {
			'base/js/events': { amd: 'base/js/events' },
			'base/js/namespace': { amd: 'base/js/namespace' },
		},
	}
]