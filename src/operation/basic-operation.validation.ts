import { IsNumber, Length, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SimpleOperationDto } from './dto.interface';

export class BasicOperationValidation implements SimpleOperationDto {
    @ApiProperty({example: '05691'})
    @Length(5, 5)
    readonly account: string;

    @ApiProperty({example: '7329'})
    @Length(4, 4)
    readonly agency: string;

    @ApiProperty({example: '100'})
    @Min(0)
    @IsNumber()
    value: number;
}