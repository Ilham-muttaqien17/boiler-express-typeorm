import { MigrationInterface } from 'typeorm';
import { Role } from '../entities/role.entity';
import dataSourceSeeder from '../data-source-seeder';

const roleRepository = dataSourceSeeder.getRepository(Role);

export class RoleSeed1716456113228 implements MigrationInterface {
  public async up(): Promise<void> {
    let role = new Role();

    role.role_name = 'admin';
    await roleRepository.save(role);

    role = new Role();
    role.role_name = 'manager';
    await roleRepository.save(role);

    role = new Role();
    role.role_name = 'accountant';
    await roleRepository.save(role);
  }

  public async down(): Promise<void> {
    await dataSourceSeeder.createQueryBuilder().delete().from(Role).execute();
  }
}
