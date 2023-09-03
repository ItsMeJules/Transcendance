import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SocketEvents } from './websocket/websocket.gateway';
import { SocketService } from './websocket/websocket.service';
import { SocketModule } from './websocket/websocket.module';
import { Express, Request } from 'express';
import { Multer } from 'multer';
import { PongModule } from './game/pong.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static'; // Add this import.
import { PrismaModule } from 'src/prisma/prisma.module';
import { TwoFaService } from './auth/two-fa.service';
import { WebSocketGateway } from '@nestjs/websockets';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Set the root path to the "public" folder.
    }),
    MulterModule.register({
      dest: 'public/images/',
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    SocketModule,
    PongModule,
    ChatModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
