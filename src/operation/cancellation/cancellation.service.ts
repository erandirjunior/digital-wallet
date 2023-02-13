import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { CancellationDto } from '../dto.interface';
import { CancellationRepository } from '../dependency.interface';

@Injectable()
export class CancellationService {
    constructor(
        @Inject('CancellationRepository') private readonly repository: CancellationRepository
    ) {}


    async cancel(payload: CancellationDto): Promise<void> {
        const account = await this.repository.getAccount(payload);
        const operation = await this.repository.getOperationByExternalId(payload.externalId);

        if (!operation) {
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
