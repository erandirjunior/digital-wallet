import { Module } from '@nestjs/common';
import {EventRegisterController} from './event-register.controller';

@Module({
    controllers: [EventRegisterController]
})
export class EventRegisterModule {}
