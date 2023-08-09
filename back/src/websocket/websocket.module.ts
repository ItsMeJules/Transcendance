import { Module } from '@nestjs/common';
import { SocketEvents } from './websocket.gateway';
import { SocketService } from './websocket.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketEvents, SocketService, JwtService, AuthService],
  exports: [SocketService, SocketEvents], 
})
export class SocketModule {}
