import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { OperationRepository } from '../dependency.interface';
import { SimpleOperationDto } from '../dto.interface';

@Injectable()
export class WithdrawService {
    constructor(
        @Inject('OperationRepository') private readonly repository: OperationRepository
    ) {}

    async withdraw(payload: SimpleOperationDto): Promise<void> {
        const account = await this.repository.getAccount(payload);

        if (!account) {
            return;
        }

        account.value -= payload.value;
        await this.repository.updateAccountValue(account);

        const registerOperation = {
            userId: account.id,
            value: payload.value,
            externalId: null
        }

        await this.repository.registerApprovedOperation(registerOperation, OperationType.WITHDRAW, 'Withdraw in account!');
    }
}
