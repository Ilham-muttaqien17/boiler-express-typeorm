import type { MigrationInterface, QueryRunner } from 'typeorm';
import dataSourceSeeder from '../data-source-seeder';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user_role.entity';

const userRepository = dataSourceSeeder.getRepository(User);
const roleRepository = dataSourceSeeder.getRepository(Role);
const userRoleRepository = dataSourceSeeder.getRepository(UserRole);

export class UserSeed1716456757093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.startTransaction();
    try {
      const role = await roleRepository.findOne({
        where: {
          role_name: 'admin'
        }
      });

      if (!role) await queryRunner.rollbackTransaction();

      const user = new User();
      user.email = 'test@gmail.com';
      user.password = '123@Password';
      user.username = 'test';
      const savedUser = await userRepository.save(user);

      const user_role = new UserRole();
      user_role.role = role as Role;
      user_role.user = savedUser;
      await userRoleRepository.save(user_role);

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    }
  }

  public async down(): Promise<void> {
    await dataSourceSeeder
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('email = :email', { email: 'test@gmail.com' })
      .execute();
  }
}
