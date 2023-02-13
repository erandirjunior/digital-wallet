import { Test, TestingModule } from '@nestjs/testing';
import { CancellationService } from './cancellation.service';
import { Transaction } from '../transaction.entity';
import OperationType from '../operation-type';
import { CancellationDto, OperationDTO, UserRegisteredDto } from '../dto.interface';
import { TransactionDto } from '../reversal/reversal.service';

describe('CancellationService', () => {
  let service: CancellationService;
  const payloadDto: CancellationDto = {
    account: "1234",
    agency: "12345",
    externalId: 'xpto123',
  };

  const cancellationDto: Transaction = {
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
    cancellationDto.value = dto.value;
    cancellationDto.userId = dto.userId;
    cancellationDto.externalId = dto.externalId;
    cancellationDto.type = operationType;
    cancellationDto.information = reason;
    cancellationDto.status = status;
  }

  let getOperationByExternalId = (): Promise<TransactionDto | null> => null;
  const registerCancelledOperation = (dto: OperationDTO, operationType: OperationType, reason: string) => {
    updateDto(dto, operationType, reason, 'cancelled');
  };
  const account: UserRegisteredDto = {
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
    cancelOperation: jest.fn(() => {
      return {
        ...account
      }
    }),
    getOperationByExternalId,
    registerCancelledOperation,
    registerApprovedOperation: (dto: OperationDTO, operationType: OperationType, reason: string) => {
      updateDto(dto, operationType, reason, 'approved');
    },
  };

  it('Should be cancelled operation because external id not found', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancellationService,
        {
          provide: 'CancellationRepository',
          useValue: {
            ...mock
          }
        }
      ],
    }).compile();

    service = module.get<CancellationService>(CancellationService);
    const result = await service.cancel(payloadDto);
    expect(cancellationDto.value).toBe(0);
    expect(cancellationDto.type).toBe(OperationType.CANCELLED);
    expect(cancellationDto.information).toBe('External reference not found or already cancelled!');
  });

  it('Should register cancellation operation', async () => {
    getOperationByExternalId = (): Promise<TransactionDto | null> => {
      return Promise.resolve({
        value: 50,
        externalId: 'xpto123',
        id: 1
      });
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancellationService,
        {
          provide: 'CancellationRepository',
          useValue: {
            ...mock,
            getOperationByExternalId
          }
        }
      ],
    }).compile();

    service = module.get<CancellationService>(CancellationService);
    const result = await service.cancel(payloadDto);
    expect(cancellationDto.value).toBe(50);
    expect(cancellationDto.type).toBe(OperationType.CANCELLED);
    expect(cancellationDto.information).toBe('Cancelled request!');
  });
});
