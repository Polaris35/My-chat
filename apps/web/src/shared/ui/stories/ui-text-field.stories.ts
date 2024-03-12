import type { Meta, StoryObj } from '@storybook/react';
import { UiTextField } from '../ui-text-field';

const meta: Meta<typeof UiTextField> = {
    component: UiTextField,
    title: 'Components/TextField',
};

export default meta;

type Story = StoryObj<typeof UiTextField>;

export const Basic: Story = {
    args: {
        label: 'text input label',
        inputProps: { placeholder: 'Placeholder' },
        className: 'w-full max-w-xs',
    },
};
