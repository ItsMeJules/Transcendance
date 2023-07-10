import { Module } from '@nestjs/common';
import { ApiController } from './controllers/api.controller';
import { ApiService } from './services/api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService]
})

export class ApiModule {}