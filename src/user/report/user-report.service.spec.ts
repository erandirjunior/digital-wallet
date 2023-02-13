import { Test, TestingModule } from '@nestjs/testing';
import { Balance, BalancePayload, Operation, UserReportService } from './user-report.service';

describe('UserReportService', () => {
  let service: UserReportService;
  const user: Balance = {
    id: 1,
    value: 100,
    name: 'Antonio Erandir',
    email: 'erandir@email.com',
    agency: "1234",
    account: "12355",
    cardNumber: "1234123412341234"
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReportService,
        {
          provide: 'ReportRepository',
          useValue: {
            getCardNumber: jest.fn(() => 1223456783038485),
            getBalance: jest.fn((): Promise<Balance | null>  => {
              return Promise.resolve(user);
            }),
            getStatement: jest.fn(() => {
              return [
                {
                  "id": 4,
                  "type": "deposit",
                  "status": "approved",
                  "value": 10,
                  "externalId": null,
                  "information": null,
                  "userId": 1,
                  "created_at": "2023-02-11T21:13:34.000Z"
                },
                {
                  "id": 5,
                  "type": "deposit",
                  "status": "approved",
                  "value": 10,
                  "externalId": null,
                  "information": null,
                  "userId": 1,
                  "created_at": "2023-02-11T21:14:34.000Z"
                }
              ]
            })
          }
        }
      ],
    }).compile();

    service = module.get<UserReportService>(UserReportService);
  });

  const payload: BalancePayload = {
    agency: user.agency,
    account: user.account
  };

  it('Should return balance report', async () => {
    const result = await service.getBalanceReport(user.account, user.agency);
    expect(result).toBe(user);
  });

  it('Should return balance report', async () => {
    const result = await service.getStatementReport(user.account, user.agency);
    expect(result.user).toBe(user);
    expect(result.operations).toHaveLength(2);
  });

  it('Should return balance report', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReportService,
        {
          provide: 'ReportRepository',
          useValue: {
            getCardNumber: jest.fn(() => null),
            getBalance: jest.fn(() => null),
            getStatement: jest.fn(() => null)
          }
        }
      ],
    }).compile();

    service = module.get<UserReportService>(UserReportService);
    const result = await service.getStatementReport(user.account, user.agency);
    expect(result).toBe(null);
  });


});
