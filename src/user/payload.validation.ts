import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Payload } from './register/user-register.service';
import { ApiProperty } from '@nestjs/swagger';

export class PayloadValidation implements Payload {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

}
