import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { ReversalDto } from '../dto.interface';
import { ReversalRepository } from '../dependency.interface';


export interface TransactionDto {
    readonly id: number,
    readonly value: number,
    readonly externalId: string
}

@Injectable()
export class ReversalService {
    constructor(
        @Inject('CancellationRepository') private readonly repository: ReversalRepository
    ) {}


    async reversal(payload: ReversalDto): Promise<void> {
        const account = await this.repository.getAccount(payload);
        const operation = await this.repository.getCancellationOperationByExternalId(payload.externalId);
        const reversalOperation = await this.repository.reversalOperationExists(payload.externalId);

        if (!operation || reversalOperation) {
            const value = 0;
            return await await this.repository.registerCancelledOperation(
                {
                    userId: account.id,
                    value,
                    externalId: payload.externalId
                },
                OperationType.REVERSAL,
                'External reference not found or request already processed!'
            );
        }

        account.value += operation.value;
        const data = {
            value: operation.value,
            externalId: operation.externalId,
            userId: account.id
        }

        await this.repository.updateAccountValue(account);
        await this.repository.registerApprovedOperation(
            data, OperationType.REVERSAL, 'Reversal requested'
        );
    }
}
