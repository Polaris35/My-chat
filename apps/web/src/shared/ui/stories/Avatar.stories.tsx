import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../Avatar';
import avatarImg from './public/avatar-image.png';

const meta: Meta<typeof Avatar> = {
    component: Avatar,
    title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Small: Story = {
    args: {
        url: avatarImg.src,
        alt: 'small avatar',
        size: 'small',
    },
};

export const Medium: Story = {
    args: {
        url: avatarImg.src,
        alt: 'medium avatar',
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        url: avatarImg.src,
        alt: 'large avatar',
        size: 'large',
    },
};
