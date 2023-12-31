const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundImage: {
				mesh: "url('https://assets.bank-data.app/meshBackgroundWhite.png')",
				darkMesh: "url('https://assets.bank-data.app/meshBackgroundDark.jpg')",
				darkScreenshotCoda: "url('https://assets.bank-data.app/Dark - Capture Compte Coda.jpg')",
				screenshotCoda: "url('https://assets.bank-data.app/Clair - Capture Compte Coda.jpg')"
			},
			colors: {
				blueBank: '#009CFF',

				blueBank01: '#1aa6ff',
				blueBank02: '#33b0ff',
				blueBank03: '#4dbaff',
				blueBank04: '#66c4ff',
				blueBank05: '#80ceff',
				blueBank06: '#99d7ff',
				blueBank07: '#b3e1ff',
				blueBank08: '#ccebff',
				blueBank09: '#e6f5ff',
				blueBank091: '#F2F9FF',

				blueBank10: '#008ce6',
				blueBank20: '#007dcc',
				blueBank30: '#006db3',
				blueBank40: '#005e99',
				blueBank50: '#004e80',
				blueBank60: '#003e66',
				blueBank70: '#002f4c',
				blueBank80: '#001f33',
				blueBank90: '#001019',

				codaOrange: '#F46A54',
				gitHubGrey: '#181617'
			},
			borderRadius: {
				default: '4px'
			},
			fontFamily: {
				poppins: ['Poppins', 'sans']
			},
			zIndex: {
				alert: 100,
				modal: 10
			}
		}
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.text-balance': {
					'text-wrap': 'balance'
				}
			});
		}),
		require('@tailwindcss/container-queries')
	]
};
