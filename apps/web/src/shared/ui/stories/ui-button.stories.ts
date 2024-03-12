import type { Meta, StoryObj } from '@storybook/react';

import { UiButton } from '../ui-button';

const meta: Meta<typeof UiButton> = {
    component: UiButton,
};

export default meta;

type Story = StoryObj<typeof UiButton>;

export const Primary: Story = {
    args: {
        children: 'Primary',
        variant: 'primary',
    },
};

export const Accent: Story = {
    args: {
        children: 'Accent',
        variant: 'accent',
    },
};
