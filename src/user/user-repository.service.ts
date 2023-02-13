import { Injectable } from '@nestjs/common';
import { Payload, UserAccount, UserRepository } from './register/user-register.service';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { Balance, BalancePayload, Operation, ReportRepository } from './report/user-report.service';
import { Transaction } from '../operation/transaction.entity';

@Injectable()
export class UserRepositoryService implements UserRepository, ReportRepository {

    private repository: Repository<User>;

    private operationRepository: Repository<Transaction>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(User);
        this.operationRepository = dataSource.getRepository(Transaction);
    }

    async accountDataIsUnique(accountNumber: string, accountAgency: string): Promise<boolean> {
        const result = await this.repository.count({
            where: {
                account: accountNumber,
                agency: accountAgency
            }
        });

        return !!result;

    }

    async findByCardNumber(cardNumber: string): Promise<boolean> {
        const result = await this.repository.count({
            where: {
                card: cardNumber
            }
        });

        return !!result;
    }

    async save(userAccount: UserAccount): Promise<void> {
        const user = {
            name: userAccount.name,
            email: userAccount.email,
            agency: userAccount.accountAgency,
            account: userAccount.accountNumber,
            card: userAccount.cardNumber,
        }
        await this.repository.save(user)
    }

    async findUser(payload: Payload): Promise<boolean> {
        const result = await this.repository.count({
            where: {
                email: payload.email
            }
        });

        return !!result;
    }

    async getBalance(account: string, agency: string): Promise<Balance | null> {
        const result = await this.repository.findOneBy({
            account,
            agency
        });

        if (!result) {
            return null;
        }

        return {
            id: result.id,
            account: result.account,
            agency: result.agency,
            email: result.email,
            name: result.name,
            value: result.value,
            cardNumber: result.card
        }
    }

    async getStatement(payload: Balance): Promise<Operation[] | null> {
        return await this.operationRepository.findBy({
            userId: payload.id
        });
    }
}
