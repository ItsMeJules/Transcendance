import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/strategy.google';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FortyTwoStrategy } from './strategy/strategy.42';
import { SocketModule } from 'src/websocket/websocket.module';
import { SocketService } from 'src/websocket/websocket.service';
import { TwoFaModule } from './two-fa/two-fa.module';
import { TwoFaService } from './two-fa/two-fa.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1d' }, // ?
    }),
    UserModule,
    PassportModule,
    SocketModule,
    TwoFaModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    FortyTwoStrategy,
    UserService,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
    JwtService,
    SocketService,
    TwoFaService,
  ], // why no guards?
  exports: [AuthService, JwtService],
})
export class AuthModule {}
