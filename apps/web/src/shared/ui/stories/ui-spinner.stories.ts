import type { Meta, StoryObj } from '@storybook/react';

import { UiSpinner } from '../ui-spinner';

const meta: Meta<typeof UiSpinner> = {
    component: UiSpinner,
};

export default meta;

type Story = StoryObj<typeof UiSpinner>;

export const Basic: Story = { args: {} };
