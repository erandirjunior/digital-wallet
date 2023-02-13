import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Transaction } from './operation/transaction.entity';
import { OperationModule } from './operation/operation.module';
import { CommandBus } from '@nestjs/cqrs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Transaction],
    }),
    UserModule,
    OperationModule
  ]
})
export class AppModule {}
