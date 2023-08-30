import { Module } from '@nestjs/common';
import { PongEvents } from './pong.gateway';
import { PongService } from './pong.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PongEvents, GameService],
  exports: [PongEvents], 
})
export class GameModule {}
