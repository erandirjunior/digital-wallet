import { IsString, Length } from 'class-validator';
import { BasicOperationValidation } from '../basic-operation.validation';
import { ApiProperty } from '@nestjs/swagger';
import { BuyDto } from '../dto.interface';

export class BuyOperationValidation extends BasicOperationValidation implements BuyDto {
    @ApiProperty()
    @Length(16, 16)
    readonly cardNumber: string;

    @ApiProperty()
    @IsString()
    @Length(5)
    readonly externalId: string;
}