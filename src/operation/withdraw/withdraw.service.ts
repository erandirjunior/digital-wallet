import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { OperationRepository } from '../dependency.interface';
import { SimpleOperationDto, UserRegisteredDto } from '../dto.interface';

@Injectable()
export class WithdrawService {
    constructor(
        @Inject('OperationRepository') private readonly repository: OperationRepository
    ) {}

    async withdraw(payload: SimpleOperationDto): Promise<void> {
        const account = await this.repository.getAccount(payload);

        await this.saveOperationIfUserExists(account, payload);
    }

    private async saveOperationIfUserExists(account: UserRegisteredDto, payload: SimpleOperationDto) {
        if (account) {
            account.value -= payload.value;
            await this.repository.updateAccountValue(account);
            await this.registerOperation(account, payload);

        }
    }

    private async registerOperation(account: UserRegisteredDto, payload: SimpleOperationDto) {
        const registerOperation = {
            userId: account.id,
            value: payload.value,
            externalId: null
        }

        await this.repository.registerApprovedOperation(registerOperation, OperationType.DEPOSIT, 'Deposit in account!');
    }
}
