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

@Module({
	imports: [PrismaModule,
		UserModule,
		PassportModule, // ADD 2 lines from vscode?
		JwtModule.register({
		secret: process.env.jwtSecret,
		signOptions: { expiresIn: '1d' },
	  }),],
	controllers: [AuthController],
	providers: [GoogleStrategy, 
				UserService, 
				PrismaService,
				AuthService,
				JwtStrategy],
})
export class AuthModule {}