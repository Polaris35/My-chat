import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../TextField';

const meta: Meta<typeof TextField> = {
    component: TextField,
    title: 'Components/TextField',
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Basic: Story = {
    args: {
        label: 'text input label',
        placeholder: 'Placeholder',
        className: 'w-full max-w-xs',
    },
};
