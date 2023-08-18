import { Module } from '@nestjs/common';
import { GameEvents } from './pong.gateway';
import { PongService } from './pong.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameEvents, JwtService, AuthService, UserService, PongService],
  exports: [GameEvents], 
})
export class PongModule {}
