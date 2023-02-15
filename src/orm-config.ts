import { User } from './user/user.entity';
import { Transaction } from './operation/transaction.entity';
import { user1676472190481 } from '../migrations/1676472190481-user';
import { transaction1676472206949 } from '../migrations/1676472206949-transaction';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Transaction],
    migrations: [user1676472190481, transaction1676472206949]
}

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrations: [user1676472190481, transaction1676472206949]
})