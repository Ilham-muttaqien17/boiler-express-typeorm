import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreTableAndRelation1717079886467 implements MigrationInterface {
  name = 'AddStoreTableAndRelation1717079886467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`stores\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`workspace_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`stores\`
            ADD CONSTRAINT \`FK_5716a6f4b1e2e67181ac4b43b65\` FOREIGN KEY (\`workspace_id\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`stores\` DROP FOREIGN KEY \`FK_5716a6f4b1e2e67181ac4b43b65\`
        `);
    await queryRunner.query(`
            DROP TABLE \`stores\`
        `);
  }
}
