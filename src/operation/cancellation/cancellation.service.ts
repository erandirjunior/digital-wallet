import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { CancellationDto, OperationDTO, UserRegisteredDto } from '../dto.interface';
import { CancellationRepository } from '../dependency.interface';

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
        return await await this.repository.registerCancelledOperation({
                userId: account.id,
                value,
                externalId: payload.externalId
            },
            OperationType.CANCELLED,
            'External reference not found or already cancelled!'
        );
    }

    private async saveOperation(account: UserRegisteredDto, operation: OperationDTO, payload: CancellationDto) {
        account.value = operation.value;
        const data = {
            userId: account.id,
            value: operation.value,
            externalId: payload.externalId
        };

        await this.repository.registerApprovedOperation(
            data, OperationType.CANCELLED, 'Cancelled request!'
        );
    }
}
