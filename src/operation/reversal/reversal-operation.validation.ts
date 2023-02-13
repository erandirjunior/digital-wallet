import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReversalDto } from '../dto.interface';

export class ReversalOperationValidation implements ReversalDto {
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