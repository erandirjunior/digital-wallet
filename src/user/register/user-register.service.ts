import { Inject, Injectable } from '@nestjs/common';

export interface GenerateCard {
    getCardNumber(): string;
}

export interface GenerateAccount {
    getAccountNumber(): string;
    getAgencyNumber(): string;
}

export interface Payload {
    name: string;
    email: string;
}

export interface UserAccount extends Payload{
    account: string;
    agency: string;
    cardNumber: string;
}

export interface UserRepository {
    findUser(payload: Payload): Promise<boolean>;
    accountDataIsUnique(accountNumber: string, accountAgency: string): Promise<boolean>;
    findByCardNumber(cardNumber: string): Promise<boolean>;
    save(userAccount: UserAccount): Promise<void>;
}

type Account = {
    accountNumber: string;
    accountAgency: string;
}

@Injectable()
export class UserRegisterService {
    constructor(
        @Inject('GenerateCard') private readonly generateCard: GenerateCard,
        @Inject('GenerateAccount') private readonly generateAccount: GenerateAccount,
        @Inject('UserRepository') private readonly repository: UserRepository
    ) {}

    async createAccount(payload: Payload): Promise<UserAccount> {
        const user = await this.repository.findUser(payload);

        if (user) {
            throw new Error('User already exists!');
        }

        const userAccountData = await this.getUserAccountData(payload);
        await this.repository.save(userAccountData);
        return userAccountData;
    }

    private async getUserAccountData(payload: Payload): Promise<UserAccount> {
        const account = await this.getAccountData();
        const cardNumber = await this.getCardNumber();

        return {
            ...payload,
            account: account.accountNumber,
            agency: account.accountAgency,
            cardNumber
        }
    }

    private async getAccountData(): Promise<Account> {
        const accountNumber = this.generateAccount.getAccountNumber();
        const accountAgency = this.generateAccount.getAgencyNumber();
        const dataAccountIsNotUnique = await this.repository.accountDataIsUnique(
            accountNumber,
            accountAgency
        );

        if (dataAccountIsNotUnique) {
            return await this.getAccountData();
        }

        return {
            accountNumber,
            accountAgency
        }
    }

    private async getCardNumber(): Promise<string> {
        const cardNumber = this.generateCard.getCardNumber();
        const isNotUniqueCardNumber = await this.repository.findByCardNumber(cardNumber);

        if (isNotUniqueCardNumber) {
            return this.getCardNumber();
        }

        return cardNumber;
    }
}
