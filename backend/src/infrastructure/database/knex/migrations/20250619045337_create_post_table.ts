import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("posts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.uuid("user_id").notNullable().references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}



export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("posts");
}

