import { Inject, Injectable } from '@nestjs/common';
import { UserAccount } from '../dependency.interface';
import OperationType from '../operation-type';
import { CancellationDto, OperationRegisteredDto } from '../dto.interface';

export interface CancellationRepository {
    getAccount(agency: string, account: string): Promise<UserAccount | null>

    cancelOperation(externalId: string): Promise<void>

    getOperationByExternalId(externalId: string): Promise<OperationRegisteredDto | null>

    registerCancelledOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>;

    registerApprovedOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>
}

@Injectable()
export class CancellationService {
    constructor(
        @Inject('CancellationRepository') private readonly repository: CancellationRepository
    ) {}


    async cancel(payload: CancellationDto): Promise<void> {
        const account = await this.repository.getAccount(payload.agency, payload.account);
        const operation = await this.repository.getOperationByExternalId(payload.externalId);

        if (!operation) {
            const value = 0;
            return await await this.repository.registerCancelledOperation(
                {...account, value},
                OperationType.CANCELLED,
                'External reference not found or already cancelled!'
            );
        }

        account.value = operation.value;
        const data = {
            value: operation.value,
            externalId: operation.externalId
        }

        await this.repository.cancelOperation(payload.externalId);
        await this.repository.registerApprovedOperation(
            {...account, ...data}, OperationType.CANCELLED, 'Cancelled request!'
        );
    }
}
