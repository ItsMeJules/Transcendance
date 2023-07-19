import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/strategy.google';

@Module({
	controllers: [AuthController],
	providers: [ GoogleStrategy ],
})
export class AuthModule {}