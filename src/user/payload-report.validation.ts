import { ApiProperty } from '@nestjs/swagger';
import { BalancePayload } from './report/user-report.service';

export class PayloadReportValidation implements BalancePayload {
    @ApiProperty()
    account: string;

    @ApiProperty()
    agency: string;
}
