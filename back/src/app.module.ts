import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [UserModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}