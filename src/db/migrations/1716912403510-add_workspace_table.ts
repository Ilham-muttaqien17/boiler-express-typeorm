import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspaceTable1716912403510 implements MigrationInterface {
  name = 'AddWorkspaceTable1716912403510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`workspaces\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`user_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`workspaces\`
            ADD CONSTRAINT \`FK_78512d762073bf8cb3fc88714c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_78512d762073bf8cb3fc88714c1\`
        `);
    await queryRunner.query(`
            DROP TABLE \`workspaces\`
        `);
  }
}
