import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [PrismaService, ChatService, AuthService],
  exports: [PrismaService],
})
export class PrismaModule {}
