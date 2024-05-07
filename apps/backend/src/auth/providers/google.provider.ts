import { firstValueFrom } from 'rxjs';
import { Provider } from './provider.interface';
import { HttpService } from '@nestjs/axios';
import {
    UseInterceptors,
    ClassSerializerInterceptor,
    BadRequestException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { ResponseProviderData } from '@auth/responses';
import { LoginDto } from '@auth/dto';
import { Provider as PrismaProvider, User } from '@prisma/client';
import { UsersService } from '@users/users.service';
import { ATTACHMENT } from 'src/constants';

export class GoogleProvider implements Provider {
    private static instance: GoogleProvider;
    private constructor(
        private readonly httpService: HttpService,
        private readonly userService: UsersService,
    ) {}

    static getInstance(
        httpService: HttpService,
        userService: UsersService,
    ): GoogleProvider {
        if (!GoogleProvider.instance) {
            GoogleProvider.instance = new GoogleProvider(
                httpService,
                userService,
            );
        }
        return GoogleProvider.instance;
    }

    async autorize(accessToken: LoginDto | string): Promise<User> {
        if (await !this.checkTokenValidity(accessToken as string)) {
            throw new UnauthorizedException('invalid token');
        }

        const userData = await this.getUserData(accessToken as string);

        const existUser = await this.userService.findByEmail(userData.email);
        if (existUser) {
            if (existUser.provider === PrismaProvider.GOOGLE) {
                return existUser;
            }

            throw new ConflictException('user with this email exist');
        }

        const newUser = await this.userService.save({
            name: userData.name,
            email: userData.email,
            image: userData.picture,
            provider: PrismaProvider.GOOGLE,
        });

        return newUser;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    private async getUserData(token: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
                ),
            );

            return new ResponseProviderData({
                name: response.data.name,
                picture: ATTACHMENT.DEFAULT_USER_AVATAR,
                email: response.data.email,
            });
        } catch (error) {
            console.error('Error checking google token validity: ', error);
            throw new BadRequestException(`can't fetch data by token ${token}`);
        }
    }

    private async checkTokenValidity(token: string): Promise<boolean> {
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
