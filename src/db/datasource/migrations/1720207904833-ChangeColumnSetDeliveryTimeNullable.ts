import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ChangeColumnSetDeliveryTimeNullable1720207904833
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "deliveries",
      "pickupTime",
      new TableColumn({
        name: "pickupTime",
        type: "timestamp",
        isNullable: true,
      })
    );
    await queryRunner.changeColumn(
      "deliveries",
      "deliveryTime",
      new TableColumn({
        name: "deliveryTime",
        type: "timestamp",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "deliveries",
      "pickupTime",
      new TableColumn({
        name: "pickupTime",
        type: "timestamp",
      })
    );
    await queryRunner.changeColumn(
      "deliveries",
      "deliveryTime",
      new TableColumn({
        name: "deliveryTime",
        type: "timestamp",
      })
    );
  }
}
