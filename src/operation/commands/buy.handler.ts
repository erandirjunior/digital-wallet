import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BuyCommand } from './buy.command';
import { BuyService } from '../buy/buy.service';

@CommandHandler(BuyCommand)
export class BuyHandler implements ICommandHandler<BuyCommand> {
    constructor(private service: BuyService) {}

    async execute(command: BuyCommand) {
        const result = await this.service.isDuplicateExternalReference(command.operationDto);

        if (!result) {
            await this.service.buy(command.operationDto);
        }
    }
}
