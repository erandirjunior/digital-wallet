import { Test, TestingModule } from '@nestjs/testing';
import { Payload, UserAccount, UserRegisterService } from './user-register.service';

describe('UserService', () => {
  let service: UserRegisterService;
  const mock = {
    userDataIsUnique: jest.fn(() => true),
    accountDataIsUnique: jest.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
    findByCardNumber: jest.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
    save: jest.fn((userAccount: UserAccount) => true),
    findUser: jest.fn((userAccount: UserAccount) => true)
  }

  const payload: Payload = {
    name: 'Erandir Junior',
    email: 'erandirjunior@email.com'
  };


  it('Throw erro duplicate user', async () => {
  const module: TestingModule = await Test.createTestingModule({
      providers: [
          UserRegisterService,
        {
          provide: 'GenerateCard',
          useValue: {
            getCardNumber: jest.fn(() => 1223456783038485),
          }
        },
        {
          provide: 'GenerateAccount',
          useValue: {
            getAccountNumber: jest.fn(() => 78352),
            getAgencyNumber: jest.fn(() => 2540),
          }
        },
        {
          provide: 'UserRepository',
          useValue: {
            ...mock
          }
        }
      ],
    }).compile();

    service = module.get<UserRegisterService>(UserRegisterService);
    const result = async () => await service.createAccount(payload);
    expect(result).rejects.toThrow('User already exists!');
  });

  it('Register user', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRegisterService,
        {
          provide: 'GenerateCard',
          useValue: {
            getCardNumber: jest.fn(() => 1223456783038485),
          }
        },
        {
          provide: 'GenerateAccount',
          useValue: {
            getAccountNumber: jest.fn(() => 78352),
            getAgencyNumber: jest.fn(() => 2540),
          }
        },
        {
          provide: 'UserRepository',
          useValue: {
            ...mock,
            findUser: jest.fn((userAccount: UserAccount) => false),
          }
        }
      ],
    }).compile();

    service = module.get<UserRegisterService>(UserRegisterService);
    const result = await service.createAccount(payload);
    expect(result.name).toEqual(payload.name);
    expect(result.email).toEqual(payload.email);
    expect(result.account).toEqual(78352);
    expect(result.agency).toEqual(2540);
    expect(result.cardNumber).toEqual(1223456783038485);
  });
});
