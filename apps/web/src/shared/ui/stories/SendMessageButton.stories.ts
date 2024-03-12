import type { Meta, StoryObj } from '@storybook/react';
import { SendMessageButton } from '../send-message-button';

const meta: Meta<typeof SendMessageButton> = {
    component: SendMessageButton,
    title: 'Components/SendMessageButton',
};

export default meta;

type Story = StoryObj<typeof SendMessageButton>;

export const Basic: Story = { args: {} };
