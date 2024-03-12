import { authControllerSuccessGoogleAuth } from '@/shared/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export type NextApiRequestWithSession = NextApiRequest & {
    user: any;
};

export default async function handler(
    req: NextApiRequestWithSession,
    res: NextApiResponse,
) {
    const token = req.user?.accessToken;

    try {
        await authControllerSuccessGoogleAuth(token);
        res.redirect(307, '/');
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch data' });
    }
}
