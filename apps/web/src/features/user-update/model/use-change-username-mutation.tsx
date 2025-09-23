import { usersControllerChangeUsername } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function UseChangeUsername() {
    const session = useSession();
    return useMutation({
        mutationFn: (username: string) => {
            return usersControllerChangeUsername(
                { newUsername: username },
                {
                    headers: {
                        Authorization:
                            'Bearer ' + session.data?.user.accessToken,
                    },
                },
            );
        },
    });
}
