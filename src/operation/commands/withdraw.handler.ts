import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WithdrawCommand } from './withdraw.command';
import { WithdrawService } from '../withdraw/withdraw.service';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand> {
    constructor(private service: WithdrawService) {}

    async execute(command: WithdrawCommand) {
        await this.service.withdraw(command.operationDto);
    }
}
