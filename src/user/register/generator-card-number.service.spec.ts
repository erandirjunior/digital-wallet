import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorCardNumberService } from './generator-card-number.service';

describe('GeneratorService', () => {
  let service: GeneratorCardNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorCardNumberService],
    }).compile();

    service = module.get<GeneratorCardNumberService>(GeneratorCardNumberService);
  });

  it('Card number should be 16 digits', () => {
    const result = service.getCardNumber();
    expect(`${result}`).toHaveLength(16);
  });
});
