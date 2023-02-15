import { BuyDto, OperationDTO, UserInformation, UserRegisteredDto } from './dto.interface';
import OperationType from './operation-type';

interface UpdateAccount {
    updateAccountValue(dto: UserRegisteredDto): Promise<void>;
}

export interface AccountRepository extends UpdateAccount {
    getAccount(basicOperation: UserInformation): Promise<UserRegisteredDto | null>;

}

interface RegisterApprovedOperation {
    registerApprovedOperation(dto: OperationDTO, operationType: OperationType, reason: string): Promise<void>;
}

interface RegisterCancelledOperation {
    registerCancelledOperation(dto: OperationDTO, operationType: OperationType, reason: string): Promise<void>;
}

export interface OperationRepository extends AccountRepository, RegisterApprovedOperation {}

export interface BuyRepository extends RegisterApprovedOperation, RegisterCancelledOperation, UpdateAccount {
    countExternalId(externalId: string): Promise<number>;

    getAccountByBuyData(dto: BuyDto): Promise<UserRegisteredDto>;
}
export interface CancellationRepository extends AccountRepository, RegisterApprovedOperation, RegisterCancelledOperation {
    getOperationByExternalId(externalId: string): Promise<OperationDTO | null>;

    cancellationRequestedExists(externalId: string): Promise<boolean>;
}

export interface ReversalRepository extends AccountRepository, RegisterApprovedOperation, RegisterCancelledOperation {
    reversalOperationExists(externalId: string): Promise<boolean>;

    getCancellationOperationByExternalId(externalId: string): Promise<OperationDTO | null>
}