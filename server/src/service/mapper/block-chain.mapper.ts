import { BlockChain } from '../../domain/block-chain.entity';
import { BlockChainDTO } from '../dto/block-chain.dto';

/**
 * A BlockChain mapper object.
 */
export class BlockChainMapper {
    static fromDTOtoEntity(entityDTO: BlockChainDTO): BlockChain {
        if (!entityDTO) {
            return;
        }
        let entity = new BlockChain();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: BlockChain): BlockChainDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new BlockChainDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
