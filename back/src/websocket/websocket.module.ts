import { Module } from '@nestjs/common';
import { SocketEvents } from './websocket.gateway';
import { SocketService } from './websocket.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PongEvents } from 'src/game/pong.gateway';
import { PongModule } from 'src/game/pong.module';
import { PongService } from 'src/game/pong.service';

@Module({
  imports: [PongModule],
  controllers: [],
  providers: [PrismaService, SocketEvents, UserService, JwtService, AuthService, PongEvents, PongService],
  exports: [ SocketEvents], 
})
export class SocketModule {}
