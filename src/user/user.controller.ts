import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { GenerateAccount, GenerateCard, UserRepository, UserRegisterService } from './register/user-register.service';
import { PayloadValidation } from './payload.validation';
import { BalancePayload, UserReportService } from './report/user-report.service';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { PayloadReportValidation } from './payload-report.validation';

@Controller('users')
export class UserController {
    constructor(
        private readonly service: UserRegisterService,
        private readonly userReportService: UserReportService
    ) {}

    @Post()
    async create(@Body() body: PayloadValidation, @Res() res) {
        try {
            const user = await this.service.createAccount(body);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: user,
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }

    }

    @ApiProperty()
    @Get('/agency/:agency/account/:account/report/balance')
    async balance(@Param() data: PayloadReportValidation, @Res() res) {
        try {
            const result = await this.userReportService.getBalanceReport(data);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: result,
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }

    @Get('/agency/:agency/account/:account/report/statement')
    async statement(@Param() data: PayloadReportValidation, @Res() res) {
        try {
            const result = await this.userReportService.getStatementReport(data);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: result,
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e,
            });
        }
    }
}
