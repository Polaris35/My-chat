import {
    CurrentConversationContext,
    MessageActionKind,
} from '@/entities/current-conversation';
import {
    CreateMessageDto,
    messagesControllerConversationMessagesList,
    messagesControllerCreateMessage,
} from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';

export function UseSendMessageMutation() {
    const { dispatchMessages } = useContext(CurrentConversationContext);
    const session = useSession();
    return useMutation({
        mutationFn: (dto: CreateMessageDto) =>
            messagesControllerCreateMessage(dto, {
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            }),
        onSuccess(data) {
            dispatchMessages({
                type: MessageActionKind.ADD,
                payload: { ...data, status: 'sended' },
            });
        },
    });
}
