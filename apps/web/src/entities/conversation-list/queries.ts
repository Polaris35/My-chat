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
    const queryClient = useQueryClient();
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
            queryClient.setQueriesData<ConversationPreviewListResponse>(
                { queryKey: [CONVERSATION.LIST] },
                (oldList) => {
                    return {
                        conversations: oldList
                            ? [...oldList.conversations, data!]
                            : [data!],
                    };
                },
            );
        },
    });
}
export function addGroupConversationMutation() {
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
        },
    });
}

// export async function createGroupConversation(
//     variables: CreateGroupConversationVariables,
//     options?: SecondParameter<typeof createInstance>,
// ) {
//     let formData = new FormData();

//     formData.append('title', variables.title);

//     if (variables.image) {
//         console.log('variables.image: ', variables.image);
//         formData.append('image', variables.image);
//     }

//     // function printFormData(formData: FormData): void {
//     //     for (const [key, value] of formData.entries()) {
//     //         console.log(`${key}: ${value}`);
//     //     }
//     // }
//     // printFormData(formData);

//     return createInstance<ConversationPreviewResponse>(
//         {
//             url: `/api/conversations/group`,
//             method: 'POST',
//             headers: { 'Content-Type': 'multipart/form-data' },
//             data: formData,
//         },
//         options,
//     );
// }
