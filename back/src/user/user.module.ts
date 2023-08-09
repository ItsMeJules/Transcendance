import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SocketService } from 'src/websocket/websocket.service';
import { SocketModule } from 'src/websocket/websocket.module';
import { SocketEvents } from 'src/websocket/websocket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [SocketModule],
	controllers: [UserController],
	providers: [UserService],
	exports : [UserService],
})
export class UserModule { }
