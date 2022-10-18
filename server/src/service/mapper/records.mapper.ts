import { Records } from '../../domain/records.entity';
import { RecordsDTO } from '../dto/records.dto';

/**
 * A Records mapper object.
 */
export class RecordsMapper {
    static fromDTOtoEntity(entityDTO: RecordsDTO): Records {
        if (!entityDTO) {
            return;
        }
        let entity = new Records();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Records): RecordsDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RecordsDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
