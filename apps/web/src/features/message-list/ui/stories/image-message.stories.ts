import type { Meta, StoryObj } from '@storybook/react';

import { ImageMessage } from '../image-message';

const meta: Meta<typeof ImageMessage> = {
    component: ImageMessage,
    title: 'message-list/image-message',
};

export default meta;

type Story = StoryObj<typeof ImageMessage>;

export const Send: Story = {
    args: {
        avatarUrl: '/api/attachments/?id=1',
        autor: 'Me',
        time: '12:34',
        message: 'Hello world',
        status: 'sending',
        type: 'send',
        imageUrls: ['/api/attachments/?id=1', '/api/attachments/?id=1'],
    },
};

export const Recive: Story = {
    args: {
        avatarUrl: '/api/attachments/?id=1',
        autor: 'Me',
        time: '12:34',
        message: 'Hello world',
        status: 'readed',
        type: 'recive',
        imageUrls: ['/api/attachments/?id=1', '/api/attachments/?id=1'],
    },
};

export const BigTextMessage: Story = {
    args: {
        avatarUrl: '/api/attachments/?id=1',
        autor: 'Me',
        time: '12:34',
        message:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam, similique optio maxime suscipit nulla, sapiente atque voluptatem vitae amet provident nam repellendus totam! Temporibus et veritatis adipisci odit voluptatum? Repudiandae.',
        status: 'readed',
        type: 'recive',
        imageUrls: ['/api/attachments/?id=1', '/api/attachments/?id=1'],
    },
};
