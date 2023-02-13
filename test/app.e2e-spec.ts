import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Register user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        "name": "Erandir Junior",
        "email": "erandir.junior@email.com"
      })
      .expect(201);
  });

  it('Error duplicate user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        "name": "Erandir Junior",
        "email": "erandir.junior@email.com"
      })
      .expect(400);
  });
});
