import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { BlockChainDTO } from '../src/service/dto/block-chain.dto';
import { BlockChainService } from '../src/service/block-chain.service';

describe('BlockChain Controller', () => {
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
            .overrideProvider(BlockChainService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all block-chains ', async () => {
        const getEntities: BlockChainDTO[] = (
            await request(app.getHttpServer())
                .get('/api/block-chains')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET block-chains by id', async () => {
        const getEntity: BlockChainDTO = (
            await request(app.getHttpServer())
                .get('/api/block-chains/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create block-chains', async () => {
        const createdEntity: BlockChainDTO = (
            await request(app.getHttpServer())
                .post('/api/block-chains')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update block-chains', async () => {
        const updatedEntity: BlockChainDTO = (
            await request(app.getHttpServer())
                .put('/api/block-chains')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update block-chains from id', async () => {
        const updatedEntity: BlockChainDTO = (
            await request(app.getHttpServer())
                .put('/api/block-chains/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE block-chains', async () => {
        const deletedEntity: BlockChainDTO = (
            await request(app.getHttpServer())
                .delete('/api/block-chains/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
