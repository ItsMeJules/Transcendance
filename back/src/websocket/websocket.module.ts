import { Module } from '@nestjs/common';
import { SocketEvents } from './websocket.gateway';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    SocketEvents,
    UserService,
    JwtService,
    AuthService,
  ],
  exports: [SocketEvents],
})
export class SocketModule {}
