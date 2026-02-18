module.exports = {
	extends: ['stylelint-config-standard'],
	rules: {
		'color-hex-length': 'long',
		'no-descending-specificity': null,
		'no-duplicate-selectors': null,
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'layer',
					'config',
				],
			},
		],
	},
};
