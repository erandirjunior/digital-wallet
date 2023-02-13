import { CancellationDto } from '../dto.interface';

export class CancellationCommand {
    constructor(public operationDto: CancellationDto) {}
}