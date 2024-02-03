import { firstValueFrom } from 'rxjs';
import { Provider } from './provider.interface';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ResponseProviderData } from '@auth/responses';

export class GoogleProvider implements Provider {
    constructor(private readonly httpService: HttpService) {}

    async getUserData(token: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
                ),
            );
            // TODO: исправить ResponseProviderData что бы возвращал только нужные поля
            return new ResponseProviderData(response.data);
        } catch (error) {
            console.error('Error checking google token validity: ', error);
            throw new BadRequestException(`can't fetch data by token ${token}`);
        }
    }

    async checkTokenValidity(token: string): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
                ),
            );
            return response.status === 200;
        } catch (error) {
            console.error('Error fetching google user data: ', error);
            return false;
        }
    }
}
