/* eslint-disable */

const path = require( 'path' )

const __library__ = 'nbrequirements'
const __package__ = 'jupyter_nbrequirements'

module.exports = [
	{// Notebook extension loader
		mode: 'production',
		entry: './src/extension.js',
		output: {
			filename: 'extension.js',
			path: path.resolve( __dirname, '..', __package__, 'static' ),
			libraryTarget: 'amd',
		},
		resolve: {
			extensions: [ '.js' ]
		},
	},
	{// Notebook extension bundle
		mode: 'production',
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
			path: path.resolve( __dirname, '..', __package__, 'static' ),
			libraryTarget: 'amd',
		},
		resolve: {
			extensions: [ '.tsx', '.ts', '.js', '.json' ]
		},
		externals: {
			'jquery': { amd: 'jquery' },
			'base/js/events': { amd: 'base/js/events' },
			'base/js/namespace': { amd: 'base/js/namespace' },
			'base/js/utils': { amd: 'base/js/utils' },
		},
	}
]