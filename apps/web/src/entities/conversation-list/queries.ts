import {
    ConversationPreviewListResponse,
    ConversationPreviewResponse,
    ConversationsControllerCreatePrivateConversationBody,
    conversationsControllerConversationPreviewList,
    conversationsControllerCreateGroupConversation,
    conversationsControllerCreatePrivateConversation,
} from '@/shared/api';
import { createInstance } from '@/shared/api/api-instace';
import { CONVERSATION } from '@/shared/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { CurrentConversationContext } from '../current-conversation';

export type CreateGroupConversationVariables = {
    title: string;
    image?: File;
};

export function useConversationListQuery() {
    const session = useSession();
    const query = useQuery({
        queryKey: [CONVERSATION.LIST],
        queryFn: () => {
            return conversationsControllerConversationPreviewList({
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            });
        },
        enabled: session.status === 'authenticated',
    });
    return {
        sessionStatus: session.status,
        data: query.data,
        isLoading: query.isPending,
        isError: query.isError,
    };
}

export function addPrivateConversationMutation() {
    const session = useSession();
    const { setConversationId } = useContext(CurrentConversationContext);
    return useMutation<
        ConversationPreviewResponse,
        Error,
        ConversationsControllerCreatePrivateConversationBody
    >({
        mutationFn: (variables) =>
            conversationsControllerCreatePrivateConversation(variables, {
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            }),
        onSettled: (data) => {
            if (!data) {
                return;
            }
            setConversationId(data.id);
        },
    });
}
export function addGroupConversationMutation() {
    const { setConversationId } = useContext(CurrentConversationContext);
    const session = useSession();
    const queryClient = useQueryClient();
    return useMutation<
        ConversationPreviewResponse,
        Error,
        CreateGroupConversationVariables
    >({
        mutationFn: (variables) =>
            conversationsControllerCreateGroupConversation(variables, {
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            }),
        onSettled: (data) => {
            if (!data) {
                return;
            }
            queryClient.setQueriesData(
                { queryKey: [CONVERSATION.LIST] },
                (oldList) => {
                    return {
                        conversations: oldList
                            ? [
                                  ...(oldList as ConversationPreviewResponse[]),
                                  data,
                              ]
                            : [data],
                    };
                },
            );
            setConversationId(data.id);
        },
    });
}
