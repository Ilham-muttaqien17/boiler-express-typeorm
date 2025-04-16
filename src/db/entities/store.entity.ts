import type { TStore } from '@src/types/store';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'stores' })
export class Store implements TStore {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 100 })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Workspace, (workspace) => workspace.stores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;
}
