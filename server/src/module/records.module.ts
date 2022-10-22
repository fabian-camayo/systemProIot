import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from '../web/rest/records.controller';
import { RecordsRepository } from '../repository/records.repository';
import { RecordsService } from '../service/records.service';
import { BlockChainService } from '../service/block-chain.service';
import { BlockChainRepository } from '../repository/block-chain.repository';

@Module({
    imports: [TypeOrmModule.forFeature([RecordsRepository, BlockChainRepository])],
    controllers: [RecordsController],
    providers: [RecordsService,BlockChainService],
    exports: [RecordsService,BlockChainService],
})
export class RecordsModule {}
