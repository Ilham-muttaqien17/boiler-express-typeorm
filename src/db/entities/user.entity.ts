import { TUser } from '@src/types/user';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert
} from 'typeorm';
import { UserRole } from './user_role.entity';
import bcrypt from 'bcrypt';
import { Workspace } from './workspace.entity';

@Entity({ name: 'users' })
export class User implements TUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 100 })
  username!: string;

  @Column('varchar', { nullable: false, length: 255 })
  password!: string;

  @Column('varchar', { nullable: false, unique: true, length: 100 })
  email!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserRole, (user_role) => user_role.user)
  users_roles!: UserRole[];

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces!: Workspace[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
