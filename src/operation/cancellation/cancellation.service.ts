import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { CancellationDto, OperationDTO, UserRegisteredDto } from '../dto.interface';
import { CancellationRepository } from '../dependency.interface';
import OperationMessage from '../OperationMessage';

@Injectable()
export class CancellationService {
    constructor(
        @Inject('CancellationRepository') private readonly repository: CancellationRepository
    ) {}

    async cancel(payload: CancellationDto): Promise<void> {
        const account = await this.repository.getAccount(payload);
        return await this.saveCancellationIfReferenceIsNew(payload, account);
    }

    private async saveCancellationIfReferenceIsNew(payload: CancellationDto, account: UserRegisteredDto) {
        const operation = await this.repository.getOperationByExternalId(payload.externalId);
        const isDuplicated = await this.repository.cancellationRequestedExists(payload.externalId);

        if (!operation || isDuplicated) {
            return await this.saveCancelledOperation(account, payload);
        }

        await this.saveOperation(account, operation, payload);
    }

    private async saveCancelledOperation(account: UserRegisteredDto, payload: CancellationDto) {
        const value = 0;
        const data = {
            userId: account.id,
            value,
            externalId: payload.externalId
        };
        return await await this.repository.registerCancelledOperation(
            data, OperationType.CANCELLATION, OperationMessage.CANCELLATION_CANCELLED
        );
    }

    private async saveOperation(account: UserRegisteredDto, operation: OperationDTO, payload: CancellationDto) {
        const data = {
            userId: account.id,
            value: operation.value,
            externalId: payload.externalId
        };

        await this.repository.registerApprovedOperation(
            data, OperationType.CANCELLATION, OperationMessage.OPERATION_SUCCESSFULLY
        );
    }
}
