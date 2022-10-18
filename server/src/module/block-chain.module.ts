import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockChainController } from '../web/rest/block-chain.controller';
import { BlockChainRepository } from '../repository/block-chain.repository';
import { BlockChainService } from '../service/block-chain.service';

@Module({
    imports: [TypeOrmModule.forFeature([BlockChainRepository])],
    controllers: [BlockChainController],
    providers: [BlockChainService],
    exports: [BlockChainService],
})
export class BlockChainModule {}
