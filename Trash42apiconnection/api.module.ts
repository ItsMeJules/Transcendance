import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
// import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { FortyTwoStrategy } from './strategies/FortyTwoStrategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

@Module({
	imports: [
	  PassportModule,
	  JwtModule.register({
		secret: process.env.jwtSecret,
		signOptions: { expiresIn: '1d' },
	  }),
	  ConfigModule,
	  UserModule,
	],
	providers: [
	  FortyTwoStrategy,
	  AuthService,
	  PrismaService
	],
	controllers: [ApiController],
  })
  export class ApiModule {}