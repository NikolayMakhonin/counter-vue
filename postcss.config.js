const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
	plugins: [
		require('postcss-exclude-files').default({
			filter:  './src/styles/common/tailwind-dev.css',
			plugins: [],
		}),
		require('tailwindcss')({}),
		require('autoprefixer')({}),
		IN_PRODUCTION && require('@fullhuman/postcss-purgecss')({
			content: ['./public/**/*.html', './src/**/*.vue'],
			defaultExtractor (content) {
				const contentWithoutStyleBlocks = content.replace(
					/<style[^]+?<\/style>/gi,
					''
				)

				const classIdAttributeSelectors = contentWithoutStyleBlocks.match(
					/(?<=["'`\s])[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
				) || []

				const tagSelectors = contentWithoutStyleBlocks.match(
					/(?<=<)[A-Za-z][A-Za-z0-9]*(?= |\/>)/g
				) || []

				// console.log(
				// 	Object.keys(
				// 		classIdAttributeSelectors.map(o => '.' + o)
				// 			.concat(tagSelectors.map(o => `<${o}>`))
				// 			.reduce((a, o) => {
				// 				a[o] = true
				// 				return a
				// 			}, {})
				// 	)
				// 		.sort()
				// 		.join('\r\n')
				// )

				return {
					attributes: {
						names: classIdAttributeSelectors,
						// values: [],
					},
					classes: classIdAttributeSelectors,
					ids: classIdAttributeSelectors,
					tags: tagSelectors,
					undetermined: [],
				}
			},
			safelist: [
				/-(leave|enter|appear)(|-(to|from|active))$/,
				/^(?!(|.*?:)cursor-move).+-move$/,
				/^router-link(|-exact)-active$/,
				/data-v-.*/
			]
		}),
		require('cssnano')({
			preset: [
				'default', {
					discardComments: {
						removeAll: true,
					},
					calc: false,
					// normalizeUnicode: false,
				},
			],
		}),
	]
}
