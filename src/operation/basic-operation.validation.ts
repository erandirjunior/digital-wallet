import { IsNumber, Length, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OperationDto } from './dto.interface';

export class BasicOperationValidation implements OperationDto {
    @ApiProperty()
    @Length(5, 5)
    readonly account: string;

    @ApiProperty()
    @Length(4, 4)
    readonly agency: string;

    @ApiProperty()
    @Min(0)
    @IsNumber()
    readonly value: number;
}