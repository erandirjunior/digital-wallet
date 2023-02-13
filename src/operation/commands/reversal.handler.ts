import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReversalCommand } from './reversal.command';
import { ReversalService } from '../reversal/reversal.service';

@CommandHandler(ReversalCommand)
export class ReversalHandler implements ICommandHandler<ReversalCommand> {
    constructor(private service: ReversalService) {}

    async execute(command: ReversalCommand) {
        await this.service.reversal(command.operationDto);
    }
}
