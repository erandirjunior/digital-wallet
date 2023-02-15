import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryService } from './repository.service';
import { DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';
import { BuyDto, OperationDTO } from './dto.interface';
import OperationType from './operation-type';

describe('UserController', () => {
  let repository: RepositoryService;

  const account = {
    account: "12345",
    agency: "7493"
  };

  const res = {
    status: function () {
      return this
    },
    json: () => null
  }

  let value: number;

  const transaction: Transaction = {
    userId: 0,
    value: 0,
    id: 0,
    status: '',
    type: '',
    externalId: '',
    created_at: new Date(),
    information: ''
  };

  const mock = {
    findOneBy: jest.fn().mockImplementation(() => null),
    count: jest.fn(() => 1),
    find: jest.fn(() => [{value: 10}]),
    save: jest.fn((data: object) => {
      value = data['value']
    }),
    insert: jest.fn((data: any) => {
      transaction.value = data.value;
      transaction.userId = data.userId;
      transaction.externalId = data.externalId;
      transaction.type = data.type;
      transaction.information = data.information;
      transaction.status = data.status;
    })
  }

  async function getModule(methods: object) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        {
          provide: DataSource,
          useValue: {
            getRepository: () => {
              return {
                ...methods
              }
            }
          }
        }
      ]
    }).compile();

    repository = module.get<RepositoryService>(RepositoryService);
  }

  it('Should return null', async () => {
    await getModule(mock);
    expect(await repository.getAccount(account)).toBeNull();
  });

  it('Should return object', async () => {
    const resp = {
      ...account,
      value: 100,
      id: 1
    }
    mock.findOneBy = jest.fn(() => resp);
    await getModule(mock);
    const result  = await repository.getAccount(account);
    expect(result.id).toBe(1);
    expect(result.value).toBe(100);
  });

  it('Should update value', async () => {
    const resp = {
      ...account,
      value: 50,
      id: 1
    }
    await getModule(mock);
    const result  = await repository.updateAccountValue(resp);
    expect(value).toBe(50);
  });

  it('Should save approved operation', async () => {
    const data: OperationDTO = {
      userId: 1,
      value: 500,
      externalId: "XPTO01"
    }
    await getModule(mock);
    await repository.registerApprovedOperation(
        data, OperationType.BUY, ''
    )
    expect(transaction.type).toBe(OperationType.BUY);
    expect(transaction.value).toBe(500);
    expect(transaction.status).toBe('approved');
  });

  it('Should save cancelled operation', async () => {
    const data: OperationDTO = {
      userId: 1,
      value: 500,
      externalId: "XPTO01"
    }
    await getModule(mock);
    await repository.registerCancelledOperation(
        data, OperationType.BUY, ''
    )
    expect(transaction.type).toBe(OperationType.BUY);
    expect(transaction.value).toBe(500);
    expect(transaction.status).toBe('cancelled');
  });

  it('Should return user registered dto', async () => {
    const resp: BuyDto = {
      ...account,
      value: 100,
      externalId: "XPTO001",
      cardNumber: "1234123412341234"
    }
    mock.findOneBy = jest.fn(() => resp);
    await getModule(mock);
    const result  = await repository.getAccountByBuyData(resp);
    expect(result.value).toBe(100);
  });

  it('Operation by external id should return null', async () => {
    mock.findOneBy = jest.fn(() => null);
    await getModule(mock);
    const result  = await repository.getOperationByExternalId("XPTO)!");
    expect(result).toBe(null);
  });

  it('Operation by external id should return object', async () => {
    mock.findOneBy = jest.fn(() => ({
      userId: 1,
      externalId: 'XPTO)!',
      value: 100
    }));
    await getModule(mock);
    const result  = await repository.getOperationByExternalId("XPTO)!");
    expect(result.value).toBe(100);
  });

  it('Operation operation by external id should return null', async () => {
    mock.findOneBy = jest.fn(() => null);
    await getModule(mock);
    const result  = await repository.getCancellationOperationByExternalId("XPTO)!");
    expect(result).toBe(null);
  });

  it('Cancellation operation by external id should return object', async () => {
    mock.findOneBy = jest.fn(() => ({
      userId: 1,
      externalId: 'XPTO)!',
      value: 100
    }));
    await getModule(mock);
    const result  = await repository.getCancellationOperationByExternalId("XPTO)!");
    expect(result.value).toBe(100);
  });

  it('Should return one data from external id', async () => {
    await getModule(mock);
    expect(await repository.countExternalId("XPTO01")).toBe(1);
  });

  it('Should return one data from external id', async () => {
    await getModule(mock);
    expect(await repository.reversalOperationExists("XPTO01")).toBeTruthy();
  });

  it('Should return one data from external id', async () => {
    await getModule(mock);
    expect(await repository.cancellationRequestedExists("XPTO01")).toBeTruthy();
  });
});
