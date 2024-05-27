import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { UserRole } from './user_role.entity';
import { RolePermission } from './role_permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 100, unique: true })
  role_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserRole, (user_role) => user_role.role)
  users_roles!: UserRole[];

  @OneToMany(() => RolePermission, (role_permission) => role_permission.role)
  roles_permissions!: RolePermission[];
}
