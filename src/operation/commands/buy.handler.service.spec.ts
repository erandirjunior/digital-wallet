import { Test, TestingModule } from '@nestjs/testing';
import { BuyDto } from '../dto.interface';
import { BuyHandler } from './buy.handler';
import { BuyService } from '../buy/buy.service';
import { CqrsModule } from '@nestjs/cqrs';
import { BuyCommand } from './buy.command';

describe('BuyService', () => {
  let service: BuyHandler;
  const payload: BuyDto = {
    account: "1234",
    agency: "12345",
    externalId: 'xpto123',
    value: 50,
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
      imports: [CqrsModule],
      providers: [
        BuyService,
        BuyHandler,
        {
          provide: 'BuyRepository',
          useValue: {
            ...useValues
          }
        }
      ],
    }).compile();

    service = module.get<BuyHandler>(BuyHandler);
  }

  it('Should register a buy', async () => {
    await getModule(mock);
    const result = await service.execute(new BuyCommand(payload));
    expect(account.value).toBe(0);
  });
});
