import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserSocketsService } from 'src/chat/user-sockets/user-sockets.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [AuthModule, JwtModule.register({ secret: process.env.jwtSecret })],
  providers: [PrismaService, ChatService, AuthService, UserSocketsService],
  exports: [PrismaService],
})
export class PrismaModule {}
