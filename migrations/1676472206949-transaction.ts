import { MigrationInterface, QueryRunner } from "typeorm"

export class transaction1676472206949 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE transaction (
                id int(11) NOT NULL AUTO_INCREMENT,
                status varchar(255) NOT NULL,
                type varchar(255) NOT NULL,
                external_id varchar(255) DEFAULT NULL,
                value double(10,2) DEFAULT NULL,
                information text,
                user_id int(11) DEFAULT NULL,
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY user_id (user_id),
                CONSTRAINT transaction_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user;`);
    }

}
