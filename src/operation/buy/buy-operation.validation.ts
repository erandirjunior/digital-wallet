import { IsString, Length } from 'class-validator';
import { BasicOperationValidation } from '../basic-operation.validation';
import { ApiProperty } from '@nestjs/swagger';

export class BuyOperationValidation extends BasicOperationValidation {
    @ApiProperty({example: '1234123412341234'})
    @Length(16, 16)
    readonly cardNumber: string;

    @ApiProperty({example: 'xpto01'})
    @IsString()
    @Length(5)
    readonly externalId: string;
}