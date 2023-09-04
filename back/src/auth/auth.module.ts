import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  JwtStrategy,
  GoogleStrategy,
  FortyTwoStrategy,
  JwtTwoFactorStrategy,
} from './strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { TwoFaService } from './two-fa.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    FortyTwoStrategy,
    JwtStrategy,
    JwtTwoFactorStrategy,
    JwtService,
    PrismaService,
    AuthService,
    TwoFaService,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
