import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawService } from './withdraw.service';
import { DepositDto, UserAccount } from '../dependency.interface';

describe('WithdrawService', () => {
  let service: WithdrawService;

  const payload: DepositDto = {
    value: 10,
    account: "1234",
    agency: "12345"
  };

  const user = {
    ...payload,
    value: 100,
    id: 1
  };

  const dependencies = {
    updateAccountValue: (dto: UserAccount) => {
      user.value = dto.value;
    },
    registerDepositTransaction: jest.fn(() => '')
  };

  async function getModule(useValues: object) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawService,
        {
          provide: 'DepositRepository',
          useValue: {
            ...useValues
          }
        }
      ],
    }).compile();

    service = module.get<WithdrawService>(WithdrawService);
  }


  it('Should throw error', async () => {
    await getModule({
      getAccount: jest.fn(async () => null),
      ...dependencies
    });
    const result = async () => await service.withdraw(payload);
    expect(result).rejects.toThrow(`Account don't exists!`);
  });


  it('Should update value account', async () => {
    await getModule({
      getAccount: jest.fn(async () => user),
      ...dependencies
    });

    const result = await service.withdraw(payload);
    expect(user.value).toBe(90);
  });
});