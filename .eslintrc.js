module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["plugin:vue/vue3-strongly-recommended", "standard"],
	parserOptions: {
		ecmaVersion: "latest",
		parser: "@typescript-eslint/parser",
		sourceType: "module",
	},
	plugins: ["vue", "@typescript-eslint"],
	rules: {
		"vue/multi-word-component-names": "off",
		camelcase: "off",
		"no-tabs": 0,
		"no-control-regex": "off",
		"vue/no-side-effects-in-computed-properties": "off",
		"no-case-declarations": "off",
		"vue/no-setup-props-destructure": "off",
		"prefer-promise-reject-errors": "off",
		"no-mixed-spaces-and-tabs": "off",
	},
	globals: {
		NodeJS: true,
	},
};
