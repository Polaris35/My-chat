import type { Meta, StoryObj } from '@storybook/react';
import { UiAvatar } from '../ui-avatar';
import avatarImg from './public/avatar-image.png';

const meta: Meta<typeof UiAvatar> = {
    component: UiAvatar,
    title: 'Components/Avatar',
};

export default meta;

type Story = StoryObj<typeof UiAvatar>;

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
