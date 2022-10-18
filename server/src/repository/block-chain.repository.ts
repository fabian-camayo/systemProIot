import { EntityRepository, Repository } from 'typeorm';
import { BlockChain } from '../domain/block-chain.entity';

@EntityRepository(BlockChain)
export class BlockChainRepository extends Repository<BlockChain> {}
