import OperationType from './operation-type';
import { BuyDto, OperationDto, OperationRegisteredDto } from './dto.interface';
import { TransactionDto } from './reversal/reversal.service';

export interface DepositDto {
    readonly account: string;

    readonly agency: string;

    value: number;
}

export interface UserAccount extends DepositDto {
    readonly id: number;
}

export interface BasicAccountRepository {
    getAccount(agency: string, account: string): Promise<OperationDto | null>;

    registerApprovedOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>;
}

interface RegisterCancelledOperation {
    registerCancelledOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void>
}

interface UpdateValueAccount {
    updateAccountValue(dto: UserAccount): Promise<void>;
}

export interface DepositRepository extends BasicAccountRepository, UpdateValueAccount {
}

export interface BuyRepository extends DepositRepository, RegisterCancelledOperation {
    countExternalId(externalId: string): Promise<number>;

    getAccountByBuyData(dto: BuyDto): Promise<UserAccount>;
}

export interface CancellationRepository extends BasicAccountRepository, RegisterCancelledOperation {
    cancelOperation(externalId: string): Promise<void>

    getOperationByExternalId(externalId: string): Promise<OperationRegisteredDto | null>
}

export interface ReversalRepository extends BasicAccountRepository, RegisterCancelledOperation, UpdateValueAccount {
    getCancellationOperationByExternalId(externalId: string): Promise<TransactionDto | null>;

    reversalOperationExists(externalId: string): Promise<boolean>;
}