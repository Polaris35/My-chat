import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['night', 'light'],
    },
};
export default config;
