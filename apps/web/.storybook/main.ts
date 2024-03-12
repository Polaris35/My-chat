import type { StorybookConfig } from '@storybook/nextjs';

import { join, dirname } from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-interactions'),
        '@storybook/addon-themes',
    ],
    framework: {
        name: getAbsolutePath('@storybook/nextjs'),
        options: {},
    },
    staticDirs: ['../src/shared/ui/stories/public'], //👈 Configures the static asset folder in Storybook
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: async (config: any) => {
        config.resolve.plugins = [
            ...(config.resolve.plugins || []),
            new TsconfigPathsPlugin({
                extensions: config.resolve.extensions,
            }),
        ];
        return config;
    },
};
export default config;
