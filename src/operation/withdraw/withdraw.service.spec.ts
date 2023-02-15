import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawService } from './withdraw.service';
import { SimpleOperationDto, UserRegisteredDto } from '../dto.interface';

describe('WithdrawService', () => {
  let service: WithdrawService;

  const payload: SimpleOperationDto = {
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
    updateAccountValue: (dto: UserRegisteredDto) => {
      user.value = dto.value;
    },
    registerApprovedOperation: jest.fn(() => '')
  };

  async function getModule(useValues: object) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawService,
        {
          provide: 'OperationRepository',
          useValue: {
            ...useValues
          }
        }
      ],
    }).compile();

    service = module.get<WithdrawService>(WithdrawService);
  }

  it('Should ignore withdraw operation', async () => {
    await getModule({
      getAccount: jest.fn(async () => null),
      ...dependencies
    });
    const result = async () => await service.withdraw(payload);
    expect(user.value).toBe(100);
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
