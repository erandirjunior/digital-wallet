import { SimpleOperationDto } from '../dto.interface';

export class DepositCommand {
    constructor(public operationDto: SimpleOperationDto) {}
}