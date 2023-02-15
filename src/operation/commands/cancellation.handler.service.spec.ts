import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from '../transaction.entity';
import OperationType from '../operation-type';
import { CancellationDto, OperationDTO, UserRegisteredDto } from '../dto.interface';
import { TransactionDto } from '../reversal/reversal.service';
import { CancellationService } from '../cancellation/cancellation.service';
import { CancellationHandler } from './cancellation.handler';
import { CancellationCommand } from './cancellation.command';
import { CqrsModule } from '@nestjs/cqrs';
import OperationMessage from '../OperationMessage';

describe('CancellationService', () => {
  let service: CancellationHandler;
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

  let getOperationByExternalId = (): Promise<TransactionDto | null> => {
    return Promise.resolve({
      value: 50,
      externalId: 'xpto123',
      id: 1
    });
  };
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
    cancellationRequestedExists: jest.fn(() => false)
  };

  it('Should register cancellation operation', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        CancellationService,
        CancellationHandler,
        CancellationCommand,
        {
          provide: 'CancellationRepository',
          useValue: {
            ...mock,
            getOperationByExternalId
          }
        }
      ],
    }).compile();

    service = module.get<CancellationHandler>(CancellationHandler);
    const result = await service.execute(new CancellationCommand(payloadDto));
    expect(cancellationDto.value).toBe(50);
    expect(cancellationDto.type).toBe(OperationType.CANCELLATION);
    expect(cancellationDto.information).toBe(OperationMessage.OPERATION_SUCCESSFULLY);
  });
});
