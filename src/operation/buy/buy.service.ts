import { Inject, Injectable } from '@nestjs/common';
import OperationType from '../operation-type';
import { BuyDto } from '../dto.interface';
import { BuyRepository } from '../dependency.interface';

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

        await this.repository.registerCancelledOperation(
            {
                userId: account.id,
                value: payload.value,
                externalId: payload.externalId
            }, OperationType.BUY, 'Duplicate buy'
        );

        return true;
    }

    async buy(payload: BuyDto): Promise<void> {
        const account = await this.repository.getAccountByBuyData(payload);

        if (account.value < payload.value) {
            account.value = payload.value;
            return await this.repository.registerCancelledOperation(
                {
                    userId: account.id,
                    value: payload.value,
                    externalId: payload.externalId
                }, OperationType.BUY, 'Insufficient funds'
            );
        }

        account.value -= payload.value;

        await this.repository.updateAccountValue(account);
        const registerOperation = {
            userId: account.id,
            value: payload.value,
            externalId: payload.externalId
        }

        await this.repository.registerApprovedOperation(registerOperation, OperationType.BUY, 'Buy in account!');
    }
}
