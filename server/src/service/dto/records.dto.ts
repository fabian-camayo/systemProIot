/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A RecordsDTO object.
 */
export class RecordsDTO extends BaseDTO {
    @ApiModelProperty({ description: 'startDate field', required: false })
    startDate: any;

    @ApiModelProperty({ description: 'endDate field', required: false })
    endDate: any;

    @ApiModelProperty({ description: 'nameProcess field', required: false })
    nameProcess: string;

    @ApiModelProperty({ description: 'detailsProcess field', required: false })
    detailsProcess: string;

    @ApiModelProperty({ description: 'device field', required: false })
    device: string;

    @ApiModelProperty({ description: 'codeDevice field', required: false })
    codeDevice: string;

    @ApiModelProperty({ description: 'descriptionDevice field', required: false })
    descriptionDevice: string;

    @ApiModelProperty({ description: 'owner field', required: false })
    owner: string;

    @ApiModelProperty({ description: 'securityKey field', required: false })
    securityKey: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
