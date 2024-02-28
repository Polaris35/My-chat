import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import avaratImg from './public/avatar-image.png';

import { Message } from '../Message';

const meta: Meta<typeof Message> = {
    component: Message,
    title: 'Components/Message',
};

export default meta;

type Story = StoryObj<typeof Message>;

export const Send: Story = {
    args: {
        avatarUrl: avaratImg.src,
        autor: 'Me',
        time: '12:34',
        message: 'Hello world',
        status: 'sending',
        type: 'send',
    },
};

export const Recive: Story = {
    args: {
        avatarUrl: avaratImg.src,
        autor: 'Me',
        time: '12:34',
        message: 'Hello world',
        status: 'readed',
        type: 'recive',
    },
};

export const BigTextMessage: Story = {
    args: {
        avatarUrl: avaratImg.src,
        autor: 'Me',
        time: '12:34',
        message:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam, similique optio maxime suscipit nulla, sapiente atque voluptatem vitae amet provident nam repellendus totam! Temporibus et veritatis adipisci odit voluptatum? Repudiandae.' +
            'Unde, optio repellendus a eligendi voluptatum iste laudantium mollitia eveniet recusandae? Voluptates iure, doloremque ipsam ipsa voluptate nulla dolore esse consequuntur. Non dolor debitis quo neque quisquam quaerat doloribus amet.' +
            'Perferendis ratione facere incidunt nostrum minima in, sit quas voluptates beatae, molestias sequi voluptas blanditiis officiis quaerat necessitatibus cumque quod animi at id corrupti, qui tempore dolores quo. Quasi, incidunt?' +
            'Cum totam laudantium quo veritatis debitis quae asperiores eius veniam vitae illum minima, labore tempore quidem sunt beatae adipisci a vel quisquam minus aliquam quos consequuntur nam earum nobis. Quidem!' +
            'Iusto nulla beatae voluptas? Explicabo eum ipsam cum accusamus, omnis quis. Dolorum, earum! Laboriosam accusamus dolor vitae recusandae officia libero mollitia adipisci, id velit minima autem expedita iusto hic temporibus?',
        status: 'readed',
        type: 'recive',
    },
};
