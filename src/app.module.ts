import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationModule } from './operation/operation.module';
import { config } from './orm-config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    OperationModule
  ]
})
export class AppModule {}
