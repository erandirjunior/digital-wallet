import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BuyCommand } from './buy.command';
import { BuyService } from '../buy/buy.service';

@CommandHandler(BuyCommand)
export class BuyHandler implements ICommandHandler<BuyCommand> {
    constructor(private service: BuyService) {}

    async execute(command: BuyCommand) {
        await this.service.buy(command.operationDto);
    }
}
