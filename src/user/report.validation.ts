import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportValidation {
    @ApiProperty({example: '05691'})
    @Length(5, 5)
    readonly account: string;

    @ApiProperty({example: '07329'})
    @Length(4, 4)
    readonly agency: string;

}
