import { Module } from '@nestjs/common';
import { SocketEvents } from './websocket.gateway';
import { SocketService } from './websocket.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketEvents, SocketService, AuthService, JwtService], 
})
export class SocketModule {}
