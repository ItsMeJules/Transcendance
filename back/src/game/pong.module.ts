import { Module } from '@nestjs/common';
import { GameEvents } from './pong.gateway';
import { PongService } from './pong.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameEvents, GameService, JwtService, AuthService, UserService, PongService],
  exports: [GameService, GameEvents], 
})
export class PongModule {}
