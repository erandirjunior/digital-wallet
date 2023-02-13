import { ReversalDto } from '../dto.interface';

export class ReversalCommand {
    constructor(public operationDto: ReversalDto) {}
}