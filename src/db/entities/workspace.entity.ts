import type { TWorkspace } from '@src/types/workspace';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';

@Entity({ name: 'workspaces' })
export class Workspace implements TWorkspace {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 100 })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Store, (store) => store.workspace)
  stores!: Store[];
}
