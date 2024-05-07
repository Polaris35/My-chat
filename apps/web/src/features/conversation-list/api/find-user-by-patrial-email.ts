import { usersControllerFindByPartOfEmail } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function FindUserByPartialEmail() {
    const [email, setEmail] = useState<string>('');
    const session = useSession();
    const query = useQuery({
        queryKey: ['UserByPartialEmail', email],
        queryFn: () =>
            usersControllerFindByPartOfEmail(email, {
                headers: {
                    Authorization: 'Bearer ' + session.data?.user.accessToken,
                },
            }),
        enabled: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (email.length >= 4) {
            query.refetch();
        }
    }, [email]);

    return {
        email,
        setEmail,
        isLoading: query.isPending,
        error: query.error,
        data: query.data,
    };
}
