import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany
} from 'typeorm';
import { TPermission } from '@src/types/permission';
import { RolePermission } from './role_permission.entity';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 50, unique: true })
  name!: TPermission;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => RolePermission, (role_permission) => role_permission.permission)
  roles_permissions!: RolePermission[];
}
