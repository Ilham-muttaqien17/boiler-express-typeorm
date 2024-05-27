import { MigrationInterface, QueryRunner } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import dataSourceSeeder from '../data-source-seeder';
import { PERMISSIONS } from '../../types/permission';

const permissionRepository = dataSourceSeeder.getRepository(Permission);

export class PermissionSeed1716821799582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      const permissions = PERMISSIONS.reduce((prev: Record<string, any>[], curr) => {
        prev.push({ name: curr });
        return prev;
      }, []);
      await permissionRepository.save(permissions);

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    }
  }

  public async down(): Promise<void> {
    await dataSourceSeeder.createQueryBuilder().delete().from(Permission).execute();
  }
}
