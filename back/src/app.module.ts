import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
// import { ApiModule } from './api/api.module';
import { AuthModule } from './api/auth/auth.module';
import { AuthController } from './api/auth/auth.controller';

@Module({
  imports: [UserModule, AuthModule],	
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}