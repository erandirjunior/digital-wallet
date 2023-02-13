import OperationType from './operation-type';
import { BuyDto } from './dto.interface';

export interface DepositDto {
    readonly account: string;

    readonly agency: string;

    externalId?: string;

    value: number;
}

export interface UserAccount extends DepositDto {
    readonly id: number;
}

export interface DepositRepository {
    getAccount(agency: string, account: string): Promise<UserAccount | null>;

    updateAccountValue(dto: UserAccount): Promise<void>;

    registerDepositTransaction(dto: UserAccount, type: OperationType): Promise<void>;
}

export interface BuyRepository extends DepositRepository {
    countExternalId(externalId: string): Promise<number>;

    getAccountByBuyData(dto: BuyDto): Promise<UserAccount>;

    registerCancelledOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>;
}