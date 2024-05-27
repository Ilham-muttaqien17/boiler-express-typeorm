import { MigrationInterface, QueryRunner } from 'typeorm';
import dataSourceSeeder from '../data-source-seeder';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role_permission.entity';

const roleRepository = dataSourceSeeder.getRepository(Role);
const permissionRepository = dataSourceSeeder.getRepository(Permission);
const rolePermissionRepository = dataSourceSeeder.getRepository(RolePermission);

export class RolePermissionSeed1716828342161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.startTransaction();
    try {
      const role = await roleRepository.findOne({
        where: {
          role_name: 'admin'
        }
      });

      if (!role) await queryRunner.rollbackTransaction();

      const permissions = await permissionRepository.find({ select: { id: true, name: true } });

      const arrRolePermission = permissions.reduce(
        (prev: Pick<RolePermission, 'permission' | 'role'>[], curr) => {
          prev.push({
            role: role as Role,
            permission: curr
          });

          return prev;
        },
        []
      );

      await rolePermissionRepository.insert(arrRolePermission);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.startTransaction();
    try {
      const role = await roleRepository.findOne({
        where: {
          role_name: 'admin'
        }
      });

      if (!role) await queryRunner.rollbackTransaction();

      const rolePermission = await rolePermissionRepository.findBy({
        role: {
          id: role?.id
        }
      });

      await rolePermissionRepository.remove(rolePermission);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
