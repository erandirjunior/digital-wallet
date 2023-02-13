import { Inject, Injectable } from '@nestjs/common';
import { BuyRepository, DepositDto, DepositRepository, UserAccount } from '../dependency.interface';
import OperationType from '../operation-type';
import { BuyDto } from '../dto.interface';

@Injectable()
export class BuyService {
    constructor(
        @Inject('BuyRepository') private readonly repository: BuyRepository
    ) {}

    async isDuplicateExternalReference(payload: BuyDto): Promise<boolean> {
        const result = await this.repository.countExternalId(payload.externalId);

        if (!result) {
            return false;
        }


        const account = await this.repository.getAccountByBuyData(payload);
        account.value = payload.value;
        account.externalId = payload.externalId;
        await this.repository.registerCancelledOperation(
            account, OperationType.BUY, 'Duplicate buy'
        );

        return true;
    }

    async buy(payload: BuyDto): Promise<void> {
        const account = await this.repository.getAccountByBuyData(payload);

        if (account.value < payload.value) {
            account.value = payload.value;
            return await this.repository.registerCancelledOperation(
                account, OperationType.BUY, 'Insufficient funds'
            );
        }

        account.value -= payload.value;

        await this.repository.updateAccountValue(account);
        const registerOperation = {
            ...account,
            value: payload.value,
            externalId: payload.externalId
        }

        await this.repository.registerDepositTransaction(registerOperation, OperationType.BUY);
    }
}
