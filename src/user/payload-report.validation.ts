import { ApiProperty } from '@nestjs/swagger';
import { BalancePayload } from './report/user-report.service';
import { IsString, Length } from 'class-validator';

export class PayloadReportValidation implements BalancePayload {
    @ApiProperty()
    @Length(5, 5)
    @IsString()
    account: string;

    @ApiProperty()
    @Length(4, 4)
    @IsString()
    agency: string;
}
