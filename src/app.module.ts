import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventRegisterModule } from './event-register/event-register.module';

@Module({
  imports: [EventRegisterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
