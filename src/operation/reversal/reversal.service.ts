import { Inject, Injectable } from '@nestjs/common';
import { DepositDto, DepositRepository, UserAccount } from '../dependency.interface';
import OperationType from '../operation-type';
import { ReversalDto } from '../dto.interface';

export interface ReversalRepository {
    getAccount(agency: string, account: string): Promise<UserAccount | null>

    getCancellationOperationByExternalId(externalId: string): Promise<TransactionDto | null>;

    reversalOperationExists(externalId: string): Promise<boolean>;

    registerApprovedOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>;

    updateAccountValue(dto: UserAccount): Promise<void>;

    registerCancelledOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>
}

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
        const account = await this.repository.getAccount(payload.agency, payload.account);
        const operation = await this.repository.getCancellationOperationByExternalId(payload.externalId);
        const reversalOperation = await this.repository.reversalOperationExists(payload.externalId);

        if (!operation || reversalOperation) {
            const value = 0;
            return await await this.repository.registerCancelledOperation(
                {...account, value},
                OperationType.REVERSAL,
                'External reference not found or request already processed!'
            );
        }

        account.value += operation.value;
        const data = {
            value: operation.value,
            externalId: operation.externalId
        }

        console.log({...account, ...data});

        await this.repository.updateAccountValue(account);
        await this.repository.registerApprovedOperation(
            {...account, ...data}, OperationType.REVERSAL, 'Reversal requested'
        );
    }
}
