import { EntityRepository, Repository } from 'typeorm';
import { Records } from '../domain/records.entity';

@EntityRepository(Records)
export class RecordsRepository extends Repository<Records> {}
