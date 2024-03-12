import { Meta, StoryObj } from '@storybook/react';
import { SignInForm } from '../sign-in-form';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api';

const meta: Meta<typeof SignInForm> = {
    component: SignInForm,
    title: 'Auth/forms/SignIn',
};

export default meta;

type Story = StoryObj<typeof SignInForm>;

export const Basic: Story = { args: {} };
