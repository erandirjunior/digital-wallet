import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { GenerateAccount, GenerateCard, UserRepository, UserRegisterService } from './register/user-register.service';
import { PayloadValidation } from './payload.validation';
import { BalancePayload, StatementReport, UserReportService } from './report/user-report.service';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiProperty, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { PayloadReportValidation } from './payload-report.validation';
import { BalanceDto } from './report/balance.dto';
import { ReportValidation } from './report.validation';

@Controller('users')
export class UserController {
    constructor(
        private readonly service: UserRegisterService,
        private readonly userReportService: UserReportService
    ) {}

    @Post()
    @ApiOperation({summary: 'Create a new user'})
    async create(@Body() body: PayloadValidation, @Res() res) {
        try {
            const user = await this.service.createAccount(body);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                data: user
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                message: e.message,
            });
        }
    }

    @ApiProperty()
    @ApiOperation({summary: 'Request the balance report'})
    @Get('/agency/:agency/account/:account/report/balance')
    @ApiExtraModels(BalanceDto)
    @ApiOkResponse({
        status: 200,
        schema: {
            $ref: getSchemaPath(BalanceDto)
        }
    })
    async balance(@Param() data: ReportValidation, @Res() res) {
        const result = await this.userReportService.getBalanceReport(
            data.account,
            data.agency,
        );
        return res.status(HttpStatus.OK).json({
            success: true,
            data: result,
        });
    }

    @Get('/agency/:agency/account/:account/report/statement')
    @ApiOperation({summary: 'Request the statement report'})
    async statement(@Param() data: ReportValidation, @Res() res) {
        const result = await this.userReportService.getStatementReport(
            data.account,
            data.agency,
        );
        return res.status(HttpStatus.OK).json({
            success: true,
            data: result,
        });
    }
}
