import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Transaction } from './operation/transaction.entity';
import { OperationModule } from './operation/operation.module';
import { CommandBus } from '@nestjs/cqrs';
import { user1676472190481 } from '../migrations/1676472190481-user';
import { transaction1676472206949 } from '../migrations/1676472206949-transaction';
import { config } from './orm-config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config/*{
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Transaction],
      migrations: [user1676472190481, transaction1676472206949],
      cli: {
        migrationsDir: 'src/migrations'
      }
    }*/),
    UserModule,
    OperationModule
  ]
})
export class AppModule {}
