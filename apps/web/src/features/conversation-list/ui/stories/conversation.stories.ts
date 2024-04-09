import type { Meta, StoryObj } from '@storybook/react';
import avatarImg from './public/avatar-image.png';

import { Conversation } from '../conversation';

const meta: Meta<typeof Conversation> = {
    component: Conversation,
    title: 'Conversations-List/Conversation',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof Conversation>;

export const Basic: Story = {
    args: {
        avatarUrl: avatarImg.src,
        title: 'Hallo world',
        senderName: 'Somebody',
        message: 'Hi guys!',
        time: '20:31',
        messageCount: 1,
    },
};

export const Long_Text: Story = {
    args: {
        avatarUrl: avatarImg.src,
        title: 'Conversation a guys who knows a guy who knows a guy who knows a guy who knows Geralt',
        senderName:
            'A guy who knows a guy who knows a guy who knows a guy who knows Geralt',
        message: 'Hi guys!',
        time: '20:31',
        messageCount: 1,
    },
};
