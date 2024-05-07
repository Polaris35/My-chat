import { addGroupConversationMutation } from '@/entities/conversation-list';
import { useState } from 'react';

export function UseGroupConversationForm() {
    const [title, setTitle] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const mutation = addGroupConversationMutation();

    return {
        title,
        setTitle,
        image,
        setImage,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        handleSubmit: () => mutation.mutate({ title: title!, image: image! }),
    };
}
