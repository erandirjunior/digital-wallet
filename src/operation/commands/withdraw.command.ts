import { SimpleOperationDto } from '../dto.interface';

export class WithdrawCommand {
    constructor(public operationDto: SimpleOperationDto) {}
}