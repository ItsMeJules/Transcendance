import { Test, TestingModule } from '@nestjs/testing';
import { TwoFaService } from './two-fa.service';

describe('TwoFaService', () => {
  let service: TwoFaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFaService],
    }).compile();

    service = module.get<TwoFaService>(TwoFaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
