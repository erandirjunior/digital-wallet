import { Inject, Injectable } from '@nestjs/common';
import { DepositRepository, UserAccount } from '../dependency.interface';
import OperationType from '../operation-type';
import { OperationDto } from '../dto.interface';

@Injectable()
export class WithdrawService {
    constructor(
        @Inject('DepositRepository') private readonly repository: DepositRepository
    ) {}

    async withdraw(payload: OperationDto): Promise<void> {
        const account = await this.repository.getAccount(payload.agency, payload.account);

        if (!account) {
            throw new Error(`Account don't exists!`);
        }

        await this.updateAccountValue(account, payload);

        await this.registerOperation(account, payload);
    }

    private async registerOperation(account: UserAccount, payload: OperationDto) {
        const registerOperation = {
            ...account,
            value: payload.value
        }
        await this.repository.registerDepositTransaction(registerOperation, OperationType.WITHDRAW);
    }

    private async updateAccountValue(account: UserAccount, payload: OperationDto) {
        account.value -= payload.value;
        await this.repository.updateAccountValue(account);
    }
}
