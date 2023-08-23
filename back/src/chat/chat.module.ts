import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SocketEvents } from '../websocket/websocket.gateway';
import { SocketService } from '../websocket/websocket.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatEventsGateway } from './chat.gateway';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [
    ChatEventsGateway,
    SocketEvents,
    SocketService,
    JwtService,
    AuthService,
    ChatService,
  ],
  exports: [SocketService, SocketEvents],
})
export class ChatModule {}
