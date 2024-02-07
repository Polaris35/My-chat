import { Injectable } from '@nestjs/common';
import { Provider as PrismaProvider } from '@prisma/client';
import { Provider } from './provider.interface';
import { GoogleProvider } from './google.provider';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProviderFactory {
    constructor(private readonly httpService: HttpService) {}
    createProvider(provider: PrismaProvider): Provider {
        switch (provider) {
            case PrismaProvider.google: {
                //TODO: сделать сингелтон
                return GoogleProvider.getInstance(this.httpService);
            }
            case PrismaProvider.discord: {
            }
            default: {
                throw new Error('Provider not supported');
            }
        }
    }
}
