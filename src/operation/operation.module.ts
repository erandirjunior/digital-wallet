import { Module } from '@nestjs/common';
import { OperationController } from './operation.controller';
import { DepositService } from './deposit/deposit.service';
import { RepositoryService } from './repository.service';
import { Transaction } from './transaction.entity';
import { WithdrawService } from './withdraw/withdraw.service';
import { BuyService } from './buy/buy.service';
import { CancellationService } from './cancellation/cancellation.service';
import { ReversalService } from './reversal/reversal.service';

@Module({
  imports: [],
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
    Transaction
  ],
  exports: ['OperationRepository', 'BuyRepository', 'CancellationRepository', 'ReversalRepository', Transaction]
})
export class OperationModule {}
