import { Module } from '@nestjs/common';
import { PongEvents } from './pong.gateway';
import { PongService } from './pong.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketEvents } from 'src/websocket/websocket.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [
    PongEvents,
    JwtService,
    AuthService,
    UserService,
    PongService,
    PrismaService,
    SocketEvents,
  ],
  exports: [PongEvents],
})
export class PongModule {}
