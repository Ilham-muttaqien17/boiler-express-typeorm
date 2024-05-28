import { TWorkspace } from '@src/types/workspace';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

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
}
