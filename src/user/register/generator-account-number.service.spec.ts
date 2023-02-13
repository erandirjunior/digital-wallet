import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorAccountNumberService } from './generator-account-number.service';

describe('AccountGeneratorService', () => {
  let service: GeneratorAccountNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorAccountNumberService],
    }).compile();

    service = module.get<GeneratorAccountNumberService>(GeneratorAccountNumberService);
  });

  it('Agency should be 4 digits', () => {
    const result = service.getAgencyNumber();
    expect(`${result}`).toHaveLength(4);
  });

  it('Account should be 5 digits', () => {
    const result = service.getAccountNumber();
    expect(`${result}`).toHaveLength(5);
  });
});
