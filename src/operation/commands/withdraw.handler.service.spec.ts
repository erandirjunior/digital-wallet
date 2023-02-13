import { Test, TestingModule } from '@nestjs/testing';
import { SimpleOperationDto, UserRegisteredDto } from '../dto.interface';
import { WithdrawHandler } from './withdraw.handler';
import { WithdrawService } from '../withdraw/withdraw.service';
import { CqrsModule } from '@nestjs/cqrs';
import { WithdrawCommand } from './withdraw.command';

describe('WithdrawHandler', () => {
  let service: WithdrawHandler;

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
      imports: [CqrsModule],
      providers: [
        WithdrawService,
        WithdrawCommand,
        WithdrawHandler,
        {
          provide: 'OperationRepository',
          useValue: {
            ...useValues
          }
        }
      ],
    }).compile();

    service = module.get<WithdrawHandler>(WithdrawHandler);
  }

  it('Should update value account', async () => {
    await getModule({
      getAccount: jest.fn(async () => user),
      ...dependencies
    });

    const result = await service.execute(new WithdrawCommand(payload));
    expect(user.value).toBe(90);
  });
});
