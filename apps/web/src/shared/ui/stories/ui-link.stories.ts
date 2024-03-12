import type { Meta, StoryObj } from '@storybook/react';

import { UiLink } from '../ui-link';

const meta: Meta<typeof UiLink> = {
    component: UiLink,
};

export default meta;

type Story = StoryObj<typeof UiLink>;

export const Basic: Story = { args: {} };
