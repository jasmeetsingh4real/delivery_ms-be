import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnPasswordInRestaurantStaffTable1719849951735
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "restaurant_staff",
      new TableColumn({
        name: "password",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("restaurant_staff", "password");
  }
}
