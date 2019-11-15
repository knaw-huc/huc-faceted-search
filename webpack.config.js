module.exports = {
	entry: {
		bundle: "./src/index.tsx",
	},
	mode: "development",
	output: {
		filename: "[name].js",
		globalObject: 'this',
		library: "HucFacetedSearch",
		libraryTarget: "umd",
		path: __dirname + "/dist",
		publicPath: "/dist/",
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader",
				options: { configFile: "tsconfig.json" },
			}
		]
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM'
	}
};
