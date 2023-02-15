import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from '../transaction.entity';
import OperationType from '../operation-type';
import { OperationDTO, ReversalDto, UserRegisteredDto } from '../dto.interface';
import { CqrsModule } from '@nestjs/cqrs';
import { ReversalService, TransactionDto } from '../reversal/reversal.service';
import { ReversalHandler } from './reversal.handler';
import { ReversalCommand } from './reversal.command';

describe('ReversalService', () => {
  let service: ReversalHandler;
  const payload: ReversalDto = {
    account: "1234",
    agency: "12345",
    externalId: 'xpto123',
  };

  const cancelledOperation: Transaction = {
    value: null,
    id: null,
    externalId: null,
    status: null,
    type: null,
    information: null,
    userId: null,
    created_at: null
  };

  function updateDto(dto: OperationDTO, operationType: OperationType, reason: string, status: string) {
    cancelledOperation.value = dto.value;
    cancelledOperation.userId = dto.userId;
    cancelledOperation.externalId = dto.externalId;
    cancelledOperation.type = operationType;
    cancelledOperation.information = reason;
    cancelledOperation.status = status;
  }

  let getOperationByExternalId = (): Promise<TransactionDto | null> => null;
  const registerApprovedOperation = (dto: OperationDTO, operationType: OperationType, reason: string) => {
    updateDto(dto, operationType, reason, 'approved');
  };
  const registerCancelledOperation = (dto: OperationDTO, operationType: OperationType, reason: string) => {
    updateDto(dto, operationType, reason, 'cancelled');
  };
  const account: UserRegisteredDto  = {
    id: 123,
    account: "1234",
    agency: "12345",
    value: 50
  }
  let mock = {
    getAccount: jest.fn(() => {
      return {
        ...account
      }
    }),
    updateAccountValue: jest.fn((dto: UserRegisteredDto) => {
      account.value = dto.value;
      return {
        ...account
      }
    }),
    registerCancelledOperation,
    getCancellationOperationByExternalId: jest.fn((): Promise<TransactionDto | null> => {
      return Promise.resolve({
        value: 50,
        externalId: 'xpto123',
        id: 1
      });
    }),
    reversalOperationExists: () => true,
    registerApprovedOperation
  };

  it('Register a reversal', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ReversalService,
        ReversalHandler,
        ReversalCommand,
        {
          provide: 'CancellationRepository',
          useValue: {
            ...mock,
            reversalOperationExists: jest.fn(() => false),
            getCancellationOperationByExternalId: jest.fn(() => {
              return {
                id: 1,
                value: 50,
                externalId: 'xpto123'
              }
            })
          }
        }
      ],
    }).compile();

    service = module.get<ReversalHandler>(ReversalHandler);

    const result = await service.execute(new ReversalCommand(payload));
    expect(account.value).toBe(100);
    expect(cancelledOperation.type).toBe(OperationType.REVERSAL);
    expect(cancelledOperation.information).toBe('Reversal requested');
  });
});
