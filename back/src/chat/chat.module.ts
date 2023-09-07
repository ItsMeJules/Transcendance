import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatEventsGateway } from './chat.gateway';
import { UserSocketsService } from './user-sockets/user-sockets.service';
import { PongEvents } from 'src/game/pong.gateway';
import { PongModule } from 'src/game/pong.module';
import { InviteLimiterService } from './invite-limiter/invite-limiter.service';

@Module({
  imports: [PongModule],
  controllers: [ChatController],
  providers: [
    ChatEventsGateway,
    JwtService,
    AuthService,
    ChatService,
    UserSocketsService,
    InviteLimiterService,
  ],
  exports: [],
})
export class ChatModule {}
