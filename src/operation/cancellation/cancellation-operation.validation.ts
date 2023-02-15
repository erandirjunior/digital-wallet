import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CancellationDto } from '../dto.interface';

export class CancellationOperationValidation implements CancellationDto {
    @ApiProperty({example: '06721'})
    @Length(5, 5)
    readonly account: string;

    @ApiProperty({example: '1839'})
    @Length(4, 4)
    readonly agency: string;

    @ApiProperty({example: 'xpto01'})
    @IsString()
    @Length(5)
    readonly externalId: string;
}