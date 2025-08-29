// src/infrastructure/database_knex/migrations/20240603000000_create_places_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  
  await knex.schema.createTable('places', (table) => {
    table.uuid('place_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enum('type', ['lodging', 'dining', 'attractions']).notNullable();
    table.string('name').notNullable();
    table.specificType('geo_coordinates', 'geography(POINT)');
    table.text('address');
    table.jsonb('details').notNullable().defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });


}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('places');
}