import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/strategy.google';
import { UserService } from 'src/database/service/user.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/database/service/prisma.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/strategy.jwt';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './strategies/strategy.42';

@Module({
	imports: [PrismaModule,
		UserModule,
		PassportModule,
		JwtModule.register({
		secret: process.env.jwtSecret,
		signOptions: { expiresIn: '1d' }, // ?
	  }),],
	controllers: [AuthController],
	providers: [GoogleStrategy, 
				FortyTwoStrategy,
				UserService, 
				PrismaService,
				AuthService,
				JwtStrategy], // why no guards?
})
export class AuthModule {}