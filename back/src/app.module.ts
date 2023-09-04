import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { SocketModule } from './websocket/websocket.module';
import { PongModule } from './game/pong.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static'; // Add this import.
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
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
  controllers: [],
  providers: [],
})
export class AppModule {}
