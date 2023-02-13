import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRegisterService } from './register/user-register.service';
import { UserRepositoryService } from './user-repository.service';
import { GeneratorCardNumberService } from './register/generator-card-number.service';
import { GeneratorAccountNumberService } from './register/generator-account-number.service';
import { User } from './user.entity';
import { UserReportService } from './report/user-report.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserRegisterService,
    UserReportService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryService
    },
    {
      provide: 'ReportRepository',
      useClass: UserRepositoryService
    },
    {
      provide: 'GenerateCard',
      useClass: GeneratorCardNumberService
    },
    {
      provide: 'GenerateAccount',
      useClass: GeneratorAccountNumberService
    },
    User
  ],
  exports: ['UserRepository', 'ReportRepository', User]
})
export class UserModule {}
