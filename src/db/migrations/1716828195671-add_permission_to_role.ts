import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermissionToRole1716828195671 implements MigrationInterface {
    name = 'AddPermissionToRole1716828195671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`permissions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(50) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`roles_permissions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`role_id\` int NULL,
                \`permission_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles\`
            ADD UNIQUE INDEX \`IDX_ac35f51a0f17e3e1fe12112603\` (\`role_name\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\`
            ADD CONSTRAINT \`FK_7d2dad9f14eddeb09c256fea719\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\`
            ADD CONSTRAINT \`FK_337aa8dba227a1fe6b73998307b\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_337aa8dba227a1fe6b73998307b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_7d2dad9f14eddeb09c256fea719\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles\` DROP INDEX \`IDX_ac35f51a0f17e3e1fe12112603\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`permissions\`
        `);
    }

}
