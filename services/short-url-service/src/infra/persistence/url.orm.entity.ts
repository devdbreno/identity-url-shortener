import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('urls')
export class UrlOrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  origin: string;

  @Column({ length: 6, unique: true })
  shortCode: string;

  @Column({ default: 0 })
  clicks: number;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
