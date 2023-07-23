import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
// import { ApiModule } from './api/api.module';
import { AuthModule } from './api/auth/auth.module';
import { AuthController } from './api/auth/auth.controller';
import { AuthService } from './api/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'nestjs-prisma';

@Module({
	imports: [JwtModule.register({
			secret: process.env.jwtSecret,
		  }),
			UserModule,	
			AuthModule,
			PrismaModule ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}