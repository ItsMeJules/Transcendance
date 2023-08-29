import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserSocketsService } from 'src/chat/user-sockets/user-sockets.service';

@Global()
@Module({
  imports: [AuthModule],
  providers: [PrismaService, ChatService, AuthService, UserSocketsService],
  exports: [PrismaService],
})
export class PrismaModule {}
