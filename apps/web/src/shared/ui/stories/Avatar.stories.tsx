import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../Avatar';

const meta: Meta<typeof Avatar> = {
    component: Avatar,
    title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Small: Story = {
    args: {
        url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
        alt: 'small avatar',
        size: 'small',
    },
};

export const Medium: Story = {
    args: {
        url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
        alt: 'medium avatar',
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
        alt: 'large avatar',
        size: 'large',
    },
};
