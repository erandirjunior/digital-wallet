import { MigrationInterface, QueryRunner } from "typeorm"

export class user1676472190481 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user (
                email   varchar(255) NOT NULL,
                id      int(11) NOT NULL AUTO_INCREMENT,
                name    varchar(255) NOT NULL,
                agency  char(4)      NOT NULL,
                account char(5)      NOT NULL,
                card    varchar(16)  NOT NULL,
                value   double(10, 2) DEFAULT '0.00',
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at datetime DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user;`);
    }

}
