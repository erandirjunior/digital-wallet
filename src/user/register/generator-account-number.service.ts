import { Injectable } from '@nestjs/common';
import { GenerateAccount } from './user-register.service';
import { getNumber } from './generator-random-number';

@Injectable()
export class GeneratorAccountNumberService implements GenerateAccount {
    getAccountNumber(): string {
        const numbers = [
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
        ];

        return numbers.join('');
    }

    getAgencyNumber(): string {
        const numbers = [
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
        ];

        return numbers.join('');
    }
}
