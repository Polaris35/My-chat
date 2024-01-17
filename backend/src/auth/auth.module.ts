import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CookieService } from './cookie.service';
import { UsersModule } from '@users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, CookieService],
    imports: [
        PrismaModule,
        UsersModule,
        PassportModule,
        JwtModule.registerAsync(options()),
    ],
})
export class AuthModule {}
