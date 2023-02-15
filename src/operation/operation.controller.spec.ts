import { Test, TestingModule } from '@nestjs/testing';
import { OperationController } from './operation.controller';
import { CommandBus } from '@nestjs/cqrs';

describe('UserController', () => {
  let controller: OperationController;

  const res = {
    status: function () {
      return this
    },
    json: () => null
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<OperationController>(OperationController);
  });

  it('Call deposit command', async () => {
    expect(await controller.deposit({
      account: "4038",
      value: 100,
      agency: "12344"
    }, res)).toBeNull();
  });

  it('Call withdraw command', async () => {
    expect(await controller.withdraw({
      account: "4038",
      value: 100,
      agency: "12344"
    }, res)).toBeNull();
  });

  it('Call buy command', async () => {
    expect(await controller.buy({
      cardNumber: "1234123312341234",
      account: "4038",
      value: 100,
      agency: "12344",
      externalId: "#000001"
    }, res)).toBeNull();
  });

  it('Call cancellation command', async () => {
    expect(await controller.cancellation({
      account: "4038",
      agency: "12344",
      externalId: "#000001"
    }, res)).toBeNull();
  });

  it('Call reversal command', async () => {
    expect(await controller.reversal({
      account: "4038",
      agency: "12344",
      externalId: "#000001"
    }, res)).toBeNull();
  });
});
