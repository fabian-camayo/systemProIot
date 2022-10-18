/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A BlockChain.
 */
@Entity('block_chain')
export class BlockChain extends BaseEntity {
    @Column({ name: 'block', nullable: true })
    block: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
