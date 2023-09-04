import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtStrategy,
  GoogleStrategy,
  FortyTwoStrategy,
  JwtTwoFactorStrategy,
} from './strategy';
import { PassportModule } from '@nestjs/passport';
import { TwoFaService } from './two-fa.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    FortyTwoStrategy,
    JwtStrategy,
    JwtTwoFactorStrategy,
    AuthService,
    TwoFaService,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
