import { Test, TestingModule } from '@nestjs/testing';
import { ReversalService, TransactionDto } from './reversal.service';
import { Transaction } from '../transaction.entity';
import { UserAccount } from '../dependency.interface';
import OperationType from '../operation-type';
import { CancellationDto } from '../dto.interface';

describe('ReversalService', () => {
  let service: ReversalService;
  const payload: CancellationDto = {
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

  function updateDto(dto: UserAccount, operationType: OperationType, reason: string, status: string) {
    cancelledOperation.value = dto.value;
    cancelledOperation.userId = dto.id;
    cancelledOperation.externalId = dto.externalId;
    cancelledOperation.type = operationType;
    cancelledOperation.information = reason;
    cancelledOperation.status = status;
  }

  let getOperationByExternalId = (): Promise<TransactionDto | null> => null;
  const registerApprovedOperation = (dto: UserAccount, operationType: OperationType, reason: string) => {
    updateDto(dto, operationType, reason, 'approved');
  };
  const registerCancelledOperation = (dto: UserAccount, operationType: OperationType, reason: string) => {
    updateDto(dto, operationType, reason, 'cancelled');
  };
  const account: UserAccount  = {
    id: 123,
    ...payload,
    value: 50
  }
  let mock = {
    getAccount: jest.fn(() => {
      return {
        ...account
      }
    }),
    updateAccountValue: jest.fn((dto: UserAccount) => {
      account.value = dto.value;
      return {
        ...account
      }
    }),
    registerCancelledOperation,
    getCancellationOperationByExternalId: jest.fn(() => null),
    reversalOperationExists: () => true,
    registerApprovedOperation
  };

  it('Register reversal cancelled', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReversalService,
        {
          provide: 'CancellationRepository',
          useValue: {
            ...mock
          }
        }
      ],
    }).compile();

    service = module.get<ReversalService>(ReversalService);

    const result = await service.reversal(payload);
    expect(cancelledOperation.value).toBe(0);
    expect(cancelledOperation.type).toBe(OperationType.REVERSAL);
    expect(cancelledOperation.information).toBe('External reference not found or request already processed!');
  });

  it('Register a reversal', async () => {
    getOperationByExternalId = (): Promise<TransactionDto | null> => {
      return Promise.resolve({
        value: 50,
        externalId: 'xpto123',
        id: 1
      });
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReversalService,
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

    service = module.get<ReversalService>(ReversalService);

    const result = await service.reversal(payload);
    expect(account.value).toBe(100);
    expect(cancelledOperation.type).toBe(OperationType.REVERSAL);
    expect(cancelledOperation.information).toBe('Reversal requested');
  });
});
