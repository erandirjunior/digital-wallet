import { Test, TestingModule } from '@nestjs/testing';
import { DepositService } from './deposit.service';
import { SimpleOperationDto, UserRegisteredDto } from '../dto.interface';

describe('UserService', () => {
  let service: DepositService;

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

  async function getModule(providers: object) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositService,
        {
          provide: 'OperationRepository',
          useValue: {
            ...providers
          }
        }
      ],
    }).compile();

    service = module.get<DepositService>(DepositService);
  }

  const dependencies = {
    updateAccountValue: (dto: UserRegisteredDto) => {
      user.value = dto.value;
    },
    registerApprovedOperation: jest.fn(() => '')
  };


  it('Should throw error', async () => {
    const useValues = {
      getAccount: jest.fn(() => null),
      ...dependencies
    }

    await getModule(useValues);

    const result = async () => await service.deposit(payload);
    expect(result).rejects.toThrow(`Account don't exists!`);
  });


  it('Should update value account', async () => {
    const useValues = {
      getAccount: jest.fn(() => user),
      ...dependencies
    }

    await getModule(useValues);

    const result = await service.deposit(payload);
    expect(user.value).toBe(110);
  });
});
