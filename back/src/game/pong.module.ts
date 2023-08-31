import { Module } from '@nestjs/common';
import { PongEvents } from './pong.gateway';
import { PongService } from './pong.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketEvents } from 'src/websocket/websocket.gateway';
import { PongStoreModule } from 'src/utils/pong-store/pong-store.module';

@Module({
  imports: [],
  controllers: [],
  providers: [PongEvents, JwtService, AuthService, UserService, PongService, PrismaService, SocketEvents],
  exports: [PongEvents], 
})
export class PongModule {}
