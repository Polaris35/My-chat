import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { PrismaModule } from '@prisma/prisma.module';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { HttpModule } from '@nestjs/axios';
import { PROVIDERS, ProviderFactory } from './providers';
import { TokenService } from './token.service';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        ...STRATEGIES,
        ...GUARDS,
        ...PROVIDERS,
        ProviderFactory,
        TokenService,
    ],
    imports: [
        PrismaModule,
        UsersModule,
        PassportModule,
        JwtModule.registerAsync(options()),
        HttpModule,
    ],
})
export class AuthModule {}
