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
import { AuthModule } from 'src/auth/auth.module';
import { WsJwtGuard } from './ws.jwt.strategy';

@Module({
  imports: [PongModule, AuthModule],
  controllers: [ChatController],
  providers: [
    ChatEventsGateway,
    JwtService,
    AuthService,
    ChatService,
    UserSocketsService,
    InviteLimiterService,
    WsJwtGuard,
  ],
  exports: [],
})
export class ChatModule {}
