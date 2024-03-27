import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light', 'night'],
    },
};
export default config;
