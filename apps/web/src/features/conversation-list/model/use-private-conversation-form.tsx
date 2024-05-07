import { addPrivateConversationMutation } from '@/entities/conversation-list';
import { ConversationsControllerCreatePrivateConversationBody } from '@/shared/api';
import { useForm } from 'react-hook-form';

export function UsePrivateConversationForm() {
    const { register, handleSubmit } =
        useForm<ConversationsControllerCreatePrivateConversationBody>();

    const mutation = addPrivateConversationMutation();

    return {
        register,
        handleSubmit: handleSubmit((data) => mutation.mutate(data)),
        isLoading: mutation.isPending,
        data: mutation.data,
    };
}
