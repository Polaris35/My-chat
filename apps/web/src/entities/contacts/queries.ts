import { usersControllerFindByEmail } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function UseSearchUserByEmail() {
    const session = useSession();
    const mutation = useMutation({
        mutationFn: (email: string) => {
            return usersControllerFindByEmail(email, {
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            });
        },
    });
    return {
        isLoading: mutation.isPending,
        mutate: mutation.mutate,
        data: mutation.data,
        isError: mutation.isError,
    };
}
