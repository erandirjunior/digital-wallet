import { BuyDto } from '../dto.interface';

export class BuyCommand {
    constructor(public operationDto: BuyDto) {}
}