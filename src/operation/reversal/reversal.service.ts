import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { OperationDTO, ReversalDto, UserRegisteredDto } from '../dto.interface';
import { ReversalRepository } from '../dependency.interface';
import OperationMessage from '../OperationMessage';


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
        return await this.saveIfReversalIsUnique(payload);
    }

    private async saveIfReversalIsUnique(payload: ReversalDto) {
        const account = await this.repository.getAccount(payload);
        const operation = await this.repository.getCancellationOperationByExternalId(payload.externalId);
        const reversalOperation = await this.repository.reversalOperationExists(payload.externalId);

        if (!operation || reversalOperation) {
            return await this.saveCancelledOperation(account, payload);
        }

        await this.saveOperation(account, operation);
    }

    private async saveCancelledOperation(account: UserRegisteredDto, payload: ReversalDto) {
        const value = 0;
        const data = {
            userId: account.id,
            value,
            externalId: payload.externalId
        };
        return await await this.repository.registerCancelledOperation(
            data,
            OperationType.REVERSAL,
            OperationMessage.REVERSAL_CANCELLED
        );
    }

    private async saveOperation(account: UserRegisteredDto, operation: OperationDTO) {
        account.value += operation.value;
        const data = {
            value: operation.value,
            externalId: operation.externalId,
            userId: account.id
        }

        await this.repository.updateAccountValue(account);
        await this.repository.registerApprovedOperation(
            data, OperationType.REVERSAL, OperationMessage.OPERATION_SUCCESSFULLY
        );
    }
}
