const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
	lintOnSave: false,
	css: {
		extract: IN_PRODUCTION,
	}
}
