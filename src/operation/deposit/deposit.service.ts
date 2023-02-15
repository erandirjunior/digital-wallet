import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { OperationRepository } from '../dependency.interface';
import { SimpleOperationDto, UserRegisteredDto } from '../dto.interface';
import OperationMessage from '../OperationMessage';

@Injectable()
export class DepositService {
    constructor(
        @Inject('OperationRepository') private readonly repository: OperationRepository
    ) {}

    async deposit(payload: SimpleOperationDto): Promise<void> {
        const account = await this.repository.getAccount(payload);

        await this.saveOperationIfUserExists(account, payload);
    }

    private async saveOperationIfUserExists(account: UserRegisteredDto, payload: SimpleOperationDto) {
        if (account) {
            account.value += payload.value;
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

        await this.repository.registerApprovedOperation(
            registerOperation, OperationType.DEPOSIT, OperationMessage.OPERATION_SUCCESSFULLY);
    }
}
