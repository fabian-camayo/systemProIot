import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RecordsDTO } from '../service/dto/records.dto';
import { RecordsMapper } from '../service/mapper/records.mapper';
import { RecordsRepository } from '../repository/records.repository';

const relationshipNames = [];

@Injectable()
export class RecordsService {
    logger = new Logger('RecordsService');

    constructor(@InjectRepository(RecordsRepository) private recordsRepository: RecordsRepository) {}

    async findById(id: number): Promise<RecordsDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.recordsRepository.findOne(id, options);
        return RecordsMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RecordsDTO>): Promise<RecordsDTO | undefined> {
        const result = await this.recordsRepository.findOne(options);
        return RecordsMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RecordsDTO>): Promise<[RecordsDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.recordsRepository.findAndCount(options);
        const recordsDTO: RecordsDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((records) => recordsDTO.push(RecordsMapper.fromEntityToDTO(records)));
            resultList[0] = recordsDTO;
        }
        return resultList;
    }

    async save(recordsDTO: RecordsDTO, creator?: string): Promise<RecordsDTO | undefined> {
        const entity = RecordsMapper.fromDTOtoEntity(recordsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.recordsRepository.save(entity);
        return RecordsMapper.fromEntityToDTO(result);
    }

    async update(recordsDTO: RecordsDTO, updater?: string): Promise<RecordsDTO | undefined> {
        const entity = RecordsMapper.fromDTOtoEntity(recordsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.recordsRepository.save(entity);
        return RecordsMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.recordsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
