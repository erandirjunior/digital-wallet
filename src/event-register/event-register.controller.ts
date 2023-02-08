import { Controller, Post, Put } from '@nestjs/common';

@Controller()
export class EventRegisterController {
  @Post('/debits')
  debit(): string {
    return 'debit'
  }

  @Post('/credits')
  credit(): string {
    return 'credit';
  }

  @Put('/chargebacks')
  chargeback(): string {
    return 'reversal';
  }

  @Put('/cancellations')
  cancellation(): string {
    return 'cancellation';
  }
}
