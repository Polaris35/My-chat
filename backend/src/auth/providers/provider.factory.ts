import { Injectable } from '@nestjs/common';
import { Provider as PrismaProvider } from '@prisma/client';
import { Provider } from './provider.interface';
import { GoogleProvider } from './google.provider';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '@users/users.service';
import { CredentialsProvider } from './credentials.provider';

@Injectable()
export class AuthProviderFactory {
    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UsersService,
    ) {}
    createProvider(provider: PrismaProvider): Provider {
        switch (provider) {
            case PrismaProvider.CREDENTIALS: {
                return CredentialsProvider.getInstance(this.userService);
            }
            case PrismaProvider.GOOGLE: {
                return GoogleProvider.getInstance(
                    this.httpService,
                    this.userService,
                );
            }
            case PrismaProvider.DISCORD: {
            }
            default: {
                throw new Error('Provider not supported');
            }
        }
    }
}
