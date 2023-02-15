import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { BuyDto, UserRegisteredDto } from '../dto.interface';
import { BuyRepository } from '../dependency.interface';
import OperationMessage from '../OperationMessage';

@Injectable()
export class BuyService {
    constructor(
        @Inject('BuyRepository') private readonly repository: BuyRepository
    ) {}

    async buy(payload: BuyDto): Promise<void> {
        const account = await this.repository.getAccountByBuyData(payload);
        return await this.saveBuyIfReferenceIsNotDuplicate(payload, account);
    }

    private async saveBuyIfReferenceIsNotDuplicate(payload: BuyDto, account: UserRegisteredDto) {
        const result = await this.repository.countExternalId(payload.externalId);

        if (result) {
            return await this.saveDuplicateOperation(account, payload);
        }

        return await this.saveBuyIfValueIsLowerThanBalanceAccount(account, payload);
    }

    private async saveDuplicateOperation(account: UserRegisteredDto, payload: BuyDto) {
        account.value = payload.value;
        return await this.repository.registerCancelledOperation(
            {
                userId: account.id,
                value: payload.value,
                externalId: payload.externalId
            }, OperationType.BUY, OperationMessage.DUPLICATED_BUY
        );
    }

    private async saveBuyIfValueIsLowerThanBalanceAccount(account: UserRegisteredDto, payload: BuyDto) {
        if (account.value < payload.value) {
            return await this.saveInsufficientBalance(account, payload);
        }

        await this.saveBuy(account, payload);
    }

    private async saveInsufficientBalance(account: UserRegisteredDto, payload: BuyDto) {
        account.value = payload.value;
        const data = {
            userId: account.id,
            value: payload.value,
            externalId: payload.externalId
        };
        return await this.repository.registerCancelledOperation(
            data, OperationType.BUY, OperationMessage.INSUFFICIENT_BALANCE
        );
    }

    private async saveBuy(account: UserRegisteredDto, payload: BuyDto) {
        account.value -= payload.value;

        await this.repository.updateAccountValue(account);
        const registerOperation = {
            userId: account.id,
            value: payload.value,
            externalId: payload.externalId
        }

        await this.repository.registerApprovedOperation(
            registerOperation,
            OperationType.BUY,
            OperationMessage.OPERATION_SUCCESSFULLY
        );
    }
}
