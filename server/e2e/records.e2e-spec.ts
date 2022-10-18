import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { RecordsDTO } from '../src/service/dto/records.dto';
import { RecordsService } from '../src/service/records.service';

describe('Records Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(RecordsService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all records ', async () => {
        const getEntities: RecordsDTO[] = (await request(app.getHttpServer()).get('/api/records').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET records by id', async () => {
        const getEntity: RecordsDTO = (
            await request(app.getHttpServer())
                .get('/api/records/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create records', async () => {
        const createdEntity: RecordsDTO = (
            await request(app.getHttpServer()).post('/api/records').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update records', async () => {
        const updatedEntity: RecordsDTO = (
            await request(app.getHttpServer()).put('/api/records').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update records from id', async () => {
        const updatedEntity: RecordsDTO = (
            await request(app.getHttpServer())
                .put('/api/records/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE records', async () => {
        const deletedEntity: RecordsDTO = (
            await request(app.getHttpServer())
                .delete('/api/records/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
