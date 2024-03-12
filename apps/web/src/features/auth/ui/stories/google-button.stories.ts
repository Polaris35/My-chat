import { Meta, StoryObj } from '@storybook/react';
import { GoogleButton } from '../google-button';

const meta: Meta<typeof GoogleButton> = {
    component: GoogleButton,
    title: 'auth/google-button',
};

export default meta;

type Story = StoryObj<typeof GoogleButton>;

export const Basic: Story = {
    args: {
        text: 'Sign in with google',
    },
};
