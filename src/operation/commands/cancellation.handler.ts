import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancellationCommand } from './cancellation.command';
import { CancellationService } from '../cancellation/cancellation.service';

@CommandHandler(CancellationCommand)
export class CancellationHandler implements ICommandHandler<CancellationCommand> {
    constructor(private service: CancellationService) {}

    async execute(command: CancellationCommand) {
        await this.service.cancel(command.operationDto);
    }
}
