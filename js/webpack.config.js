/* eslint-disable */

const path = require( 'path' )

const __library__ = 'nbrequirements'
const __package__ = 'jupyter_nbrequirements'

const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )

module.exports = [
	{// Notebook extension loader
		mode: 'development',
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
		mode: 'development',
		entry: './src/index.ts',
		resolve: {
			alias: {
				vue$: 'vue/dist/vue.esm.js'
			},
			extensions: [ '.tsx', '.ts', '.js', '.json' ]
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								appendTsSuffixTo: [ /\.vue$/ ],
								appendTsxSuffixTo: [ /\.vue$/ ]
							}
						}
					],
					exclude: /node_modules/
				},
				{
					test: /\.(sc|sa|c)ss$/,
					use: [
						"vue-style-loader",
						"css-loader",
						{
							loader: 'sass-loader',
						}
					]
				},
				{
					test: /\.vue$/,
					use: [ "vue-loader" ]
				}
			]
		},
		output: {
			filename: 'index.js',
			path: path.resolve( __dirname, '..', __package__, 'static' ),
			libraryTarget: 'amd',
		},
		externals: {
			'jquery': { amd: 'jquery' },
			'base/js/events': { amd: 'base/js/events' },
			'base/js/namespace': { amd: 'base/js/namespace' },
			'base/js/utils': { amd: 'base/js/utils' },
			'notebook/js/codecell': { amd: 'notebook/js/codecell' },
		},
		devtool: 'source-map',
		plugins: [
			new VueLoaderPlugin()
		]
	}
]