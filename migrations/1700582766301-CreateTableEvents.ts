import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableEvents1700582766301 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`
        create table if not exists events (
            id serial,
            name text not null,
            description text,
            primary key (id)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropTable('events');
  }
}
