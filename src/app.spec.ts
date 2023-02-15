import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { UserAccount } from './user/register/user-register.service';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRegistered: UserAccount;
  const userRegisterPayload = {
      "name": "Erandir Junior",
      "email": "erandir.junior@email.com"
  };
  const externalReference = '##0001';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll((done) => {
      dataSource.query('DELETE FROM user WHERE email = ?', [userRegistered.email])
      app.close()
      done();
  })

  it('Register user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(userRegisterPayload)
      .expect(201)
      .expect((response: request.Response) => {
        userRegistered = response.body.data;
        expect(userRegistered.account).toHaveLength(5)
        expect(userRegistered.agency).toHaveLength(4)
      })
  });

  it('Error duplicate user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(userRegisterPayload)
      .expect(400);
  });

  it('Get balance null', () => {
    return request(app.getHttpServer())
      .get('/users/agency/null/account/null/report/balance')
      .expect(200)
      .expect((response: request.Response) => {
          const {success, data} = response.body;
          expect(success).toBe(true)
          expect(data).toBe(null)
      })
  });

  it('Get balance', () => {
    return request(app.getHttpServer())
      .get(`/users/agency/${userRegistered.agency}/account/${userRegistered.account}/report/balance`)
      .expect(200)
      .expect((response: request.Response) => {
          const {success, data} = response.body;
          expect(success).toBe(true);
          expect(data.account).toBe(userRegistered.account)
          expect(data.agency).toBe(userRegistered.agency)
      })
  });

  it('Get statement null', () => {
    return request(app.getHttpServer())
      .get('/users/agency/null/account/null/report/statement')
      .expect(200)
      .expect((response: request.Response) => {
          const {success, data} = response.body;
          expect(success).toBe(true)
          expect(data).toBe(null)
      })
  });

  it('Get statement', () => {
    return request(app.getHttpServer())
      .get(`/users/agency/${userRegistered.agency}/account/${userRegistered.account}/report/statement`)
      .expect(200)
      .expect((response: request.Response) => {
          const {success, data} = response.body;
          expect(success).toBe(true);
          expect(data.user.account).toBe(userRegistered.account)
          expect(data.user.agency).toBe(userRegistered.agency)
      })
  });
});
