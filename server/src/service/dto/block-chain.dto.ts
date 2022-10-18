/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A BlockChainDTO object.
 */
export class BlockChainDTO extends BaseDTO {
    @ApiModelProperty({ description: 'block field', required: false })
    block: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
