import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from './transaction.entity';
import OperationType from './operation-type';
import { BuyRepository, DepositRepository, UserAccount } from './dependency.interface';
import { CancellationRepository } from './cancelled/cancellation.service';
import { ReversalRepository } from './reversal/reversal.service';
import { BuyDto, OperationRegisteredDto } from './dto.interface';

@Injectable()
export class RepositoryService implements DepositRepository, BuyRepository, CancellationRepository, ReversalRepository {

    private userRepository: Repository<User>;

    private transactionRepository: Repository<Transaction>;

    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(User);
        this.transactionRepository = dataSource.getRepository(Transaction);
    }
    async getAccount(agency: string, account: string): Promise<UserAccount | null> {
        const result = await this.userRepository.findOneBy({
            account,
            agency
        });

        if (!result) {
            return null;
        }

        return {
            account,
            agency,
            value: result.value,
            id: result.id,
            externalId: null
        }
    }

    async registerDepositTransaction(dto: UserAccount, operationType: OperationType): Promise<void> {
        const transaction = new Transaction();
        transaction.value = dto.value;
        transaction.userId = dto.id;
        transaction.externalId = dto.externalId;
        transaction.type = operationType;
        await this.transactionRepository.insert(transaction);
    }

    async updateAccountValue(dto: UserAccount): Promise<void> {
        const [result] = await this.userRepository.find({
            where: {
                id: dto.id
            }
        });
        result.value = dto.value;
        await this.userRepository.save(result);
    }

    async getAccountByBuyData(dto: BuyDto): Promise<UserAccount> {
        const result = await this.userRepository.findOneBy({
            account: dto.account,
            agency: dto.agency,
            card: +dto.cardNumber
        });

        return {
            account: dto.account,
            agency: dto.agency,
            value: result.value,
            id: result.id,
            externalId: null
        }
    }

    async registerCancelledOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void> {
        const transaction = new Transaction();
        transaction.value = dto.value;
        transaction.userId = dto.id;
        transaction.externalId = dto.externalId;
        transaction.type = operationType;
        transaction.information = reason;
        transaction.status = 'cancelled';
        await this.transactionRepository.insert(transaction);
    }

    async countExternalId(externalId: string): Promise<number> {
        return await this.transactionRepository.count({
            where: {
                externalId
            }
        });
    }

    async cancelOperation(externalId: string): Promise<void> {
        const result = await this.transactionRepository.findOneBy({
            externalId,
            status: 'approved'
        });

        result.status = 'cancelled';
        await this.transactionRepository.save(result);
    }

    async getOperationByExternalId(externalId: string): Promise<OperationRegisteredDto | null> {
        const result = await this.transactionRepository.findOneBy({
            externalId,
            status: 'approved',
            type: 'buy'
        });

        if (!result) {
            return null;
        }

        return {
            value: result.value,
            id: result.id,
            externalId
        }
    }

    async getCancellationOperationByExternalId(externalId: string): Promise<OperationRegisteredDto | null> {
        const result = await this.transactionRepository.findOneBy({
            externalId,
            status: 'approved',
            type: OperationType.CANCELLED
        });

        if (!result) {
            return null;
        }

        return {
            value: result.value,
            id: result.id,
            externalId
        }
    }

    async registerApprovedOperation(dto: UserAccount, operationType: OperationType, reason: string): Promise<void> {
        const transaction = new Transaction();
        transaction.value = dto.value;
        transaction.userId = dto.id;
        transaction.externalId = dto.externalId;
        transaction.type = operationType;
        transaction.information = reason;
        transaction.status = 'approved';
        await this.transactionRepository.insert(transaction);
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
}
