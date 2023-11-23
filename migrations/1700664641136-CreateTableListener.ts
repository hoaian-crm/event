//@ts-ignore
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableListener1700664641136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`
        create table if not exists listeners (
            id serial,
            name text not null,
            description text not null,
            "createdAt" timestamp default NOW(),
            "updatedAt" timestamp default NOW(),
            "deletedAt" timestamp,
            event_id int not null,
            primary key (id),
            constraint fk_event foreign key(event_id) references events(id)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropTable('listeners');
  }
}
