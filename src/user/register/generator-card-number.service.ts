import { Injectable } from '@nestjs/common';
import { GenerateCard } from './user-register.service';
import { getNumber } from './generator-random-number';

@Injectable()
export class GeneratorCardNumberService implements GenerateCard {
    getCardNumber(): string {
        const numbers = [
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
            getNumber(),
        ];

        return numbers.join('');
    }
}
