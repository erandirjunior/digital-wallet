import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { DepositService } from './deposit/deposit.service';
import { BasicOperationValidation } from './basic-operation.validation';
import { WithdrawService } from './withdraw/withdraw.service';
import { BuyOperationValidation } from './buy/buy-operation.validation';
import { BuyService } from './buy/buy.service';
import { CancellationService } from './cancellation/cancellation.service';
import { CancellationOperationValidation } from './cancellation/cancellation-operation.validation';
import { ReversalService } from './reversal/reversal.service';
import { ReversalOperationValidation } from './reversal/reversal-operation.validation';
import { CommandBus } from '@nestjs/cqrs';
import { DepositCommand } from './commands/deposit.command';
import { WithdrawCommand } from './commands/withdraw.command';
import { BuyCommand } from './commands/buy.command';
import { CancellationCommand } from './commands/cancellation.command';
import { ReversalCommand } from './commands/reversal.command';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class OperationController {
    constructor(private commandBus: CommandBus) {}

    @Post('deposits')
    @ApiOperation({summary: 'Request a deposit to account sent'})
    async create(@Body() body: BasicOperationValidation, @Res() res) {
        this.commandBus.execute(
            new DepositCommand(body)
        );
        return res.status(HttpStatus.OK).json();
    }

    @Post('withdraws')
    @ApiOperation({summary: 'Request a withdraw to account sent'})
    async withdraw(@Body() body: BasicOperationValidation, @Res() res) {
        this.commandBus.execute(
            new WithdrawCommand(body)
        );
        return res.status(HttpStatus.OK).json();
    }

    @Post('buys')
    @ApiOperation({summary: 'Request a buy to account sent'})
    async buy(@Body() body: BuyOperationValidation, @Res() res) {
        this.commandBus.execute(
            new BuyCommand(body)
        );
        return res.status(HttpStatus.OK).json();
    }

    @Post('cancellations')
    @ApiOperation({summary: 'Request a cancellation to account sent'})
    async cancellation(@Body() body: CancellationOperationValidation, @Res() res) {
        this.commandBus.execute(
            new CancellationCommand(body)
        );
        return res.status(HttpStatus.OK).json();
    }

    @Post('reversals')
    @ApiOperation({summary: 'Request a reversal to account sent'})
    async reversal(@Body() body: ReversalOperationValidation, @Res() res) {
        this.commandBus.execute(
            new ReversalCommand(body)
        );
        return res.status(HttpStatus.OK).json();
    }
}
