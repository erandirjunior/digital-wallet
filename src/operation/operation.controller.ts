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

@Controller()
export class OperationController {
    constructor(
        private readonly depositService: DepositService,
        private readonly withdrawService: WithdrawService,
        private readonly buyService: BuyService,
        private readonly cancellationService: CancellationService,
        private readonly reversalService: ReversalService
    ) {}

    @Post('deposits')
    async create(@Body() body: BasicOperationValidation, @Res() res) {
        try {
            await this.depositService.deposit(body);
            return res.status(HttpStatus.CREATED).json();
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }

    @Post('withdraws')
    async withdraw(@Body() body: BasicOperationValidation, @Res() res) {
        try {
            await this.withdrawService.withdraw(body);
            return res.status(HttpStatus.CREATED).json();
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }

    @Post('buys')
    async buy(@Body() body: BuyOperationValidation, @Res() res) {
        try {
            const response = await this.buyService.isDuplicateExternalReference(body);

            if (response) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: true,
                    message: 'Duplicate external reference',
                });
            }

            await this.buyService.buy(body);
            return res.status(HttpStatus.CREATED).json();
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }

    @Post('cancellations')
    async cancellation(@Body() body: CancellationOperationValidation, @Res() res) {
        try {
            await this.cancellationService.cancel(body);
            return res.status(HttpStatus.CREATED).json();
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }

    @Post('reversals')
    async reversal(@Body() body: ReversalOperationValidation, @Res() res) {
        try {
            await this.reversalService.reversal(body);
            return res.status(HttpStatus.CREATED).json();
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }
}
