import NextAuth from 'next-auth';
import { authOptions } from '@/shared/api';

export default NextAuth(authOptions);
