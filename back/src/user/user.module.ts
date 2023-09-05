import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtTwoFactorStrategy } from 'src/auth/strategy/jwt.two-fa.strategy';
import { JwtStrategy } from 'src/auth/strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/websocket/websocket.module';
import { SocketEvents } from 'src/websocket/websocket.gateway';

@Module({
  imports: [AuthModule, PassportModule, PrismaModule, SocketModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    JwtStrategy,
    JwtTwoFactorStrategy,
    SocketEvents,
  ],
  exports: [UserService],
})
export class UserModule {}
