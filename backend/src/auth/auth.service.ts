import {
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UsersService } from '@users/users.service';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { Provider, User } from '@prisma/client';
import { ProviderFactory } from './providers/provider.factory';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UsersService,
        private readonly providerFactory: ProviderFactory,
        private readonly tokenService: TokenService,
    ) {}

    async register(dto: RegisterDto) {
        const user: User = await this.userService
            .findByEmail(dto.email)
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (user) {
            throw new ConflictException('user with this email exist');
        }
        const dtoWithProvider = { ...dto, provider: Provider.credentials };
        return this.userService.save(dtoWithProvider).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }
    async autorizeWithCredentials(
        dto: LoginDto,
        agent: string,
    ): Promise<Tokens> {
        const user: User = await this.userService
            .findByEmail(dto.email)
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (!user || compareSync(user.password, dto.password)) {
            throw new UnauthorizedException('Incorrect login or password');
        }

        return this.tokenService.generateTokens(user, agent);
    }

    async autorizeWithProvider(
        token: string,
        agent: string,
        provider_type: Provider,
    ) {
        const provider = this.providerFactory.createProvider(provider_type);

        if (await !provider.checkTokenValidity(token)) {
            throw new UnauthorizedException('invalid token');
        }

        const userData = await provider.getUserData(token);

        const existUser = await this.userService.findByEmail(userData.email);
        if (existUser) {
            if (existUser.provider === provider_type) {
                return this.tokenService.generateTokens(existUser, agent);
            }
            // переписать описание ошибки
            throw new UnauthorizedException('user with this email exist');
        }

        const newUser = await this.userService.save({
            name: userData.name,
            email: userData.email,
            image: userData.picture,
            provider: provider_type,
        });

        return this.tokenService.generateTokens(newUser, agent);
    }
}
