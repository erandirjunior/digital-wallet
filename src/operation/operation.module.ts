import { Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { DepositService } from './deposit/deposit.service';
import { RepositoryService } from './repository.service';
import { Transaction } from './transaction.entity';
import { WithdrawService } from './withdraw/withdraw.service';
import { BuyService } from './buy/buy.service';
import { CancellationService } from './cancellation/cancellation.service';
import { ReversalService } from './reversal/reversal.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DepositCommand } from './commands/deposit.command';
import { DepositHandler } from './commands/deposit.handler';
import { WithdrawCommand } from './commands/withdraw.command';
import { WithdrawHandler } from './commands/withdraw.handler';
import { BuyHandler } from './commands/buy.handler';
import { BuyCommand } from './commands/buy.command';
import { CancellationHandler } from './commands/cancellation.handler';
import { CancellationCommand } from './commands/cancellation.command';
import { ReversalCommand } from './commands/reversal.command';
import { ReversalHandler } from './commands/reversal.handler';

@Module({
  imports: [CqrsModule],
  controllers: [OperationController],
  providers: [
    DepositService,
    WithdrawService,
    BuyService,
    CancellationService,
    ReversalService,
    {
      provide: 'OperationRepository',
      useClass: RepositoryService
    },
    {
      provide: 'BuyRepository',
      useClass: RepositoryService
    },
    {
      provide: 'CancellationRepository',
      useClass: RepositoryService
    },
    {
      provide: 'ReversalRepository',
      useClass: RepositoryService
    },
    Transaction,
    DepositCommand,
    DepositHandler,
    WithdrawCommand,
    WithdrawHandler,
    BuyCommand,
    BuyHandler,
    CancellationCommand,
    CancellationHandler,
    ReversalCommand,
    ReversalHandler
  ],
  exports: ['OperationRepository', 'BuyRepository', 'CancellationRepository', 'ReversalRepository', Transaction]
})
export class OperationModule {}
