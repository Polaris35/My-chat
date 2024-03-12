import Image from 'next/image';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { usersControllerMe } from '@/shared/api';

type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
};

export function HomePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['users', 'me'],
        queryFn: usersControllerMe,
    });
    return (
        <main
            className={'flex min-h-screen flex-col items-center justify-center'}
        >
            {isLoading || <span>user: {JSON.stringify(data)}</span>}
            {error?.message}
        </main>
    );
}
