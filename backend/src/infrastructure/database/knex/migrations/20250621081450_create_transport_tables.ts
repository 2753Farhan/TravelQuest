import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transport_options', (table) => {
    table.uuid('transport_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('transport_type').notNullable();
    table.string('provider');
    table.jsonb('details').notNullable().defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

  await knex.schema.createTable('transport_routes', (table) => {
    table.uuid('route_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('transport_id').notNullable().references('transport_id').inTable('transport_options');
    table.uuid('start_place_id').notNullable().references('place_id').inTable('places');
    table.uuid('end_place_id').references('place_id').inTable('places');
    table.decimal('cost', 10, 2);
    table.string('duration'); 
    table.jsonb('details').notNullable().defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

  await knex.schema.raw(`
    CREATE INDEX idx_transport_routes_start_end ON transport_routes (start_place_id, end_place_id);
    CREATE INDEX idx_transport_routes_transport ON transport_routes (transport_id);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transport_routes');
  await knex.schema.dropTable('transport_options');
}