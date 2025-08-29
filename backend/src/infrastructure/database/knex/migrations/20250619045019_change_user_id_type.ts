import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
 
  await knex.schema.alterTable("users", (table) => {
    table.uuid("id_uuid").notNullable().defaultTo(knex.raw("gen_random_uuid()"));
  });
  await knex.raw(`
    UPDATE users
    SET id_uuid = gen_random_uuid()
    WHERE id IS NOT NULL;
  `);

  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("id");
  });

  await knex.schema.alterTable("users", (table) => {
    table.renameColumn("id_uuid", "id");
  });


  await knex.schema.alterTable("users", (table) => {
    table.uuid("id").primary().alter();
  });


}

export async function down(knex: Knex): Promise<void> {

  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("id");
    table.increments("id").primary().alter(); // Revert to serial
  });

}