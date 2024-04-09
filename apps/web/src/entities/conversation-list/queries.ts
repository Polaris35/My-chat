import {
    conversationsControllerConversationList,
    conversationsControllerCreateGroupConversation,
    conversationsControllerCreatePrivateConversation,
} from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const conversationsListKey = ['conversation'];

export function useConversationListQuery() {
    const session = useSession();
    const mutation = useMutation({
        mutationFn: () => {
            return conversationsControllerConversationList({
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            });
        },
    });
    useEffect(() => {
        if (session.status === 'authenticated') {
            mutation.mutate();
        }
    }, [session.status]);
    return {
        sessionStatus: session.status,
        data: mutation.data,
        isLoading: mutation.isPending,
        isError: mutation.isError,
    };
}

export function addPrivateConversationMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: conversationsControllerCreatePrivateConversation,
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: conversationsListKey,
            });
        },
    });
}
export function addGruopConversationMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: conversationsControllerCreateGroupConversation,
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: conversationsListKey,
            });
        },
    });
}
