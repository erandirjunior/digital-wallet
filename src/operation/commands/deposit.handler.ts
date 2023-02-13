import { DepositService } from '../deposit/deposit.service';
import { DepositCommand } from './deposit.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand> {
    constructor(private service: DepositService) {}

    async execute(command: DepositCommand) {
        await this.service.deposit(command.operationDto);
    }
}
