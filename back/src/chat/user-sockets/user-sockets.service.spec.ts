import { Test, TestingModule } from '@nestjs/testing';
import { UserSocketsService } from './user-sockets.service';

describe('UserSocketsService', () => {
  let service: UserSocketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSocketsService],
    }).compile();

    service = module.get<UserSocketsService>(UserSocketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
