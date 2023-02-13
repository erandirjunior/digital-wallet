import { Test, TestingModule } from '@nestjs/testing';
import { BuyService } from './buy.service';
import { BuyDto } from '../dto.interface';

describe('BuyService', () => {
  let service: BuyService;
  const payload: BuyDto = {
    account: "1234",
    agency: "12345",
    externalId: 'xpto123',
    value: 100,
    cardNumber: '1234123412341234',
  };
  const account: BuyDto  = {
    ...payload,
    value: 50
  };
  let mock = {
    countExternalId: () => 0,
    getAccountByBuyData: jest.fn(() => {
      return {
        ...account
      }
    }),
    registerApprovedOperation: jest.fn(() => ''),
    registerCancelledOperation: jest.fn(() => '1223456783038485'),
    updateAccountValue: jest.fn((data: BuyDto) => {
      account.value = data.value
    }),
  };

  async function getModule(useValues: object) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyService,
        {
          provide: 'BuyRepository',
          useValue: {
            ...useValues
          }
        }
      ],
    }).compile();

    service = module.get<BuyService>(BuyService);
  }

  it('Should return false because buy is duplicate', async () => {
    await getModule(mock);
    const result = await service.isDuplicateExternalReference(payload);
    expect(result).toBeFalsy();
  });

  it('Should return true', async () => {
    mock.countExternalId = () => 1;
    await getModule(mock);
    const result = await service.isDuplicateExternalReference(payload);
    expect(result).toBeTruthy();
  });

  it('Should register insufficient funds', async () => {
    await getModule(mock);
    const result = await service.buy(payload);
    expect(account.value).toBe(50);
  });

  it('Should register a buy', async () => {
    payload.value = 50;
    await getModule(mock);
    const result = await service.buy(payload);
    expect(account.value).toBe(0);
  });
});
