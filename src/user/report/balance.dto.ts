import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Balance } from './user-report.service';

export class BalanceDto implements Balance {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    account: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    agency: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cardNumber: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    value: number;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

}
