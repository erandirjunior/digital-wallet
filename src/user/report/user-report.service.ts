import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../register/user-register.service';
import { Column } from 'typeorm';

export interface BalancePayload {
    agency: string;

    account: string;
}

export interface Balance {
    id: number;

    agency: string;

    account: string;

    cardNumber: number

    name: string;

    email: string;

    value: number;
}

export interface Operation {
    id: number;

    type: string;

    status: string;

    value: number;

    externalId: string;

    information: string;

    userId: number;

    created_at: Date;
}

export interface StatementReport {
    user: BalancePayload;
    operations: Operation[] | null;
}

export interface ReportRepository {
    getBalance(payload: BalancePayload): Promise<Balance | null>

    getStatement(payload: Balance): Promise<Operation[] | null>
}

@Injectable()
export class UserReportService {
    constructor(
        @Inject('ReportRepository') private readonly repository: ReportRepository
    ) {}

    async getBalanceReport(payload: BalancePayload): Promise<Balance | null> {
        return await this.repository.getBalance(payload);
    }

    async getStatementReport(payload: BalancePayload): Promise<StatementReport | null> {
        const user = await this.repository.getBalance(payload);
        const operations = await this.repository.getStatement(user);
        return {
            user,
            operations
        }
    }
}
