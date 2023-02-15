import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from './transaction.entity';
import OperationType from './operation-type';
import {
    BuyRepository, CancellationRepository,
    OperationRepository, ReversalRepository
} from './dependency.interface';
import {
    BuyDto,
    OperationDTO,
    UserInformation,
    UserRegisteredDto
} from './dto.interface';

@Injectable()
export class RepositoryService implements OperationRepository, BuyRepository, CancellationRepository, ReversalRepository {
    private userRepository: Repository<User>;

    private transactionRepository: Repository<Transaction>;

    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(User);
        this.transactionRepository = dataSource.getRepository(Transaction);
    }
    async getAccount(basicOperation: UserInformation): Promise<UserRegisteredDto | null> {
        const result = await this.userRepository.findOneBy({
            account: basicOperation.account,
            agency: basicOperation.agency
        });

        if (!result) {
            return null;
        }

        return {
            ...basicOperation,
            value: result.value,
            id: result.id,
        }
    }

    async registerApprovedOperation(dto: OperationDTO, operationType: OperationType, reason: string): Promise<void> {
        await this.saveTransaction(dto, operationType, reason, 'approved');
    }

    async updateAccountValue(dto: UserRegisteredDto): Promise<void> {
        const [result] = await this.userRepository.find({
            where: {
                id: dto.id
            }
        });
        result.value = dto.value;
        await this.userRepository.save(result);
    }

    async countExternalId(externalId: string): Promise<number> {
        return await this.transactionRepository.count({
            where: {
                externalId
            }
        });
    }

    async getAccountByBuyData(dto: BuyDto): Promise<UserRegisteredDto> {
        const result = await this.userRepository.findOneBy({
            account: dto.account,
            agency: dto.agency,
            card: dto.cardNumber
        });

        return {
            account: result.account,
            agency: result.agency,
            value: result.value,
            id: result.id
        }
    }

    async registerCancelledOperation(dto: OperationDTO, operationType: OperationType, reason: string): Promise<void> {
        await this.saveTransaction(dto, operationType, reason, 'cancelled');
    }

    private async saveTransaction(
        dto: OperationDTO,
        operationType: OperationType,
        reason: string,
        status: string,
    ) {
        const transaction = new Transaction();
        transaction.value = dto.value;
        transaction.userId = dto.userId;
        transaction.externalId = dto.externalId;
        transaction.type = operationType;
        transaction.information = reason;
        transaction.status = status;
        await this.transactionRepository.insert(transaction);
    }

    async getOperationByExternalId(externalId: string): Promise<OperationDTO | null> {
        const result = await this.transactionRepository.findOneBy({
            externalId,
            status: 'approved',
            type: 'buy'
        });

        if (!result) {
            return null;
        }

        return {
            userId: result.userId,
            externalId,
            value: result.value
        }
    }

    async getCancellationOperationByExternalId(externalId: string): Promise<OperationDTO | null> {
        const result = await this.transactionRepository.findOneBy({
            externalId,
            status: 'approved',
            type: OperationType.CANCELLATION
        });

        if (!result) {
            return null;
        }

        return {
            externalId,
            value: result.value,
            userId: result.userId
        }
    }

    async reversalOperationExists(externalId: string): Promise<boolean> {
        const result = await this.transactionRepository.count({
            where: {
                externalId,
                status: 'approved',
                type: OperationType.REVERSAL
            }
        });

        return !!result;
    }

    async cancellationRequestedExists(externalId: string): Promise<boolean> {
        const result = await this.transactionRepository.count({
            where: {
                externalId,
                status: 'approved',
                type: OperationType.CANCELLATION
            }
        });

        return !!result;
    }
}
