import { Test, TestingModule } from '@nestjs/testing';
import { SimpleOperationDto, UserRegisteredDto } from '../dto.interface';
import { CqrsModule } from '@nestjs/cqrs';
import { DepositCommand } from './deposit.command';
import { DepositHandler } from './deposit.handler';
import { DepositService } from '../deposit/deposit.service';

describe('DepositHandler', () => {
  let service: DepositHandler;

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
      imports: [CqrsModule],
      providers: [
        DepositService,
        DepositCommand,
        DepositHandler,
        {
          provide: 'OperationRepository',
          useValue: {
            ...providers
          }
        }
      ],
    }).compile();

    service = module.get<DepositHandler>(DepositHandler);
  }

  const dependencies = {
    updateAccountValue: (dto: UserRegisteredDto) => {
      user.value = dto.value;
    },
    registerApprovedOperation: jest.fn(() => '')
  };


  it('Should update value account', async () => {
    const useValues = {
      getAccount: jest.fn(() => user),
      ...dependencies
    }

    await getModule(useValues);

    const result = await service.execute(new DepositCommand(payload));
    expect(user.value).toBe(110);
  });
});
