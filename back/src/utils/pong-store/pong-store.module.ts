import { Module } from '@nestjs/common';
import { PongStoreService } from './pong-store.service';

@Module({
  providers: [PongStoreService],
  exports: [PongStoreService],  // This allows other modules to access this service.
})
export class PongStoreModule {}
