import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static'; // Add this import.
import { WebsocketGateway } from './websocket/websocket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TwoFaModule } from './auth/two-fa/two-fa.module';
import { TwoFaService } from './auth/two-fa/two-fa.service';

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
    TwoFaModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, WebsocketGateway],
})
export class AppModule {}
