import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatEventsGateway } from './chat.gateway';
import { UserSocketsService } from './user-sockets/user-sockets.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [
    ChatEventsGateway,
    JwtService,
    AuthService,
    ChatService,
    UserSocketsService,
  ],
  exports: [],
})
export class ChatModule {}
