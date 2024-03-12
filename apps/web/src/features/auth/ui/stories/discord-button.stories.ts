import { Meta, StoryObj } from '@storybook/react';
import { DiscordButton } from '../discord-button';

const meta: Meta<typeof DiscordButton> = {
    component: DiscordButton,
    title: 'auth/discord-button',
};

export default meta;

type Story = StoryObj<typeof DiscordButton>;

export const Basic: Story = {
    args: {
        text: 'Sign in with discord',
    },
};
