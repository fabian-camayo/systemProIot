import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BlockChainDTO } from '../service/dto/block-chain.dto';
import { BlockChainMapper } from '../service/mapper/block-chain.mapper';
import { BlockChainRepository } from '../repository/block-chain.repository';

const relationshipNames = [];

@Injectable()
export class BlockChainService {
    logger = new Logger('BlockChainService');

    constructor(@InjectRepository(BlockChainRepository) private blockChainRepository: BlockChainRepository) {}

    async findById(id: number): Promise<BlockChainDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.blockChainRepository.findOne(id, options);
        return BlockChainMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<BlockChainDTO>): Promise<BlockChainDTO | undefined> {
        const result = await this.blockChainRepository.findOne(options);
        return BlockChainMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<BlockChainDTO>): Promise<[BlockChainDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.blockChainRepository.findAndCount(options);
        const blockChainDTO: BlockChainDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(blockChain => blockChainDTO.push(BlockChainMapper.fromEntityToDTO(blockChain)));
            resultList[0] = blockChainDTO;
        }
        return resultList;
    }

    async save(blockChainDTO: BlockChainDTO, creator?: string): Promise<BlockChainDTO | undefined> {
        const entity = BlockChainMapper.fromDTOtoEntity(blockChainDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.blockChainRepository.save(entity);
        return BlockChainMapper.fromEntityToDTO(result);
    }

    async update(blockChainDTO: BlockChainDTO, updater?: string): Promise<BlockChainDTO | undefined> {
        const entity = BlockChainMapper.fromDTOtoEntity(blockChainDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.blockChainRepository.save(entity);
        return BlockChainMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.blockChainRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
