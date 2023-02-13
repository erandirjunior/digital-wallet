import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({synchronize: false})
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ default: 'approved' })
    status: string;

    @Column()
    value: number;

    @Column({ name: 'external_id', default: null })
    externalId: string;

    @Column()
    information: string;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    created_at: Date;
}