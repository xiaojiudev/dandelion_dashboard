import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': '#fdf2f6',
                    '100': '#fce7ef',
                    '200': '#fad0e0',
                    '300': '#f8a9c5',
                    '400': '#f06292',
                    '500': '#e94b7c',
                    '600': '#d82a57',
                    '700': '#bb1b3f',
                    '800': '#9b1935',
                    '900': '#811a30',
                    '950': '#4f0817',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
        fontFamily: {
            'tilt': ['"Tilt Neon"'],
            'dosis': ['"Dosis"'],
            'dancing-script': ['"Dancing Script", "cursive"'],
            'wendy-std-bold': ['"wendy-lp-std-bold", "sans-serif"'],
        },
    },
    plugins: [],
}
export default config
