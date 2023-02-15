import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReversalDto } from '../dto.interface';

export class ReversalOperationValidation implements ReversalDto {
    @ApiProperty({example: '83901'})
    @Length(5, 5)
    readonly account: string;

    @ApiProperty({example: '8302'})
    @Length(4, 4)
    readonly agency: string;

    @ApiProperty({example: 'xpto01'})
    @IsString()
    @Length(5)
    readonly externalId: string;
}