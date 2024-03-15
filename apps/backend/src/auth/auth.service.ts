import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UsersService } from '@users/users.service';
import { Provider, User } from '@prisma/client';
import { AuthProviderFactory } from './providers/provider.factory';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UsersService,
        private readonly providerFactory: AuthProviderFactory,
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
        const dtoWithProvider = { ...dto, provider: Provider.CREDENTIALS };
        return this.userService.save(dtoWithProvider).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async autorize(
        dto: LoginDto | string,
        agent: string,
        provider_type: Provider,
    ) {
        const provider = this.providerFactory.createProvider(provider_type);
        const user = await provider.autorize(dto);
        const tokens = await this.tokenService.generateTokens(user, agent);
        return { user, tokens };
    }
}
