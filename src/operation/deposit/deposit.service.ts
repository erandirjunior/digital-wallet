import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { DepositRepository } from '../dependency.interface';
import { OperationDto } from '../dto.interface';

@Injectable()
export class DepositService {
    constructor(
        @Inject('DepositRepository') private readonly repository: DepositRepository
    ) {}

    async deposit(payload: OperationDto): Promise<void> {
        const account = await this.repository.getAccount(payload.agency, payload.account);

        if (!account) {
            throw new Error(`Account don't exists!`);
        }

        account.value += payload.value;
        await this.repository.updateAccountValue(account);

        const registerOperation = {
            ...account,
            value: payload.value
        }

        await this.repository.registerDepositTransaction(registerOperation, OperationType.DEPOSIT);
    }
}
