/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Records.
 */
@Entity('records')
export class Records extends BaseEntity {
    @Column({ type: 'date', name: 'start_date', nullable: true })
    startDate: any;

    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: any;

    @Column({ name: 'name_process', nullable: true })
    nameProcess: string;

    @Column({ name: 'details_process', nullable: true })
    detailsProcess: string;

    @Column({ name: 'device', nullable: true })
    device: string;

    @Column({ name: 'code_device', nullable: true })
    codeDevice: string;

    @Column({ name: 'description_device', nullable: true })
    descriptionDevice: string;

    @Column({ name: 'owner', nullable: true })
    owner: string;

    @Column({ name: 'security_key', nullable: true })
    securityKey: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
