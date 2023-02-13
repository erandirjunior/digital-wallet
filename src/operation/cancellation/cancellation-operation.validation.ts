import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CancellationDto } from '../dto.interface';

export class CancellationOperationValidation implements CancellationDto {
    @ApiProperty()
    @Length(5, 5)
    readonly account: string;

    @ApiProperty()
    @Length(4, 4)
    readonly agency: string;

    @ApiProperty()
    @IsString()
    @Length(5)
    readonly externalId: string;
}