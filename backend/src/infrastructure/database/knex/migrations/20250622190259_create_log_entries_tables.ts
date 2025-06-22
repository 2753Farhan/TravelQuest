// migrations/TIMESTAMP_create_log_entries_table.ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('log_entries', (table) => {
    table.uuid('entry_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    table.uuid('log_id').notNullable()
      .references('log_id').inTable('travel_logs')
      .onDelete('CASCADE');
    
    table.uuid('place_id').nullable()
      .references('place_id').inTable('places')
      .onDelete('SET NULL');
    
    table.uuid('transport_id').nullable()
      .references('route_id').inTable('transport_routes')
      .onDelete('SET NULL');
    
    table.string('title').notNullable();
    table.decimal('cost', 12, 2).nullable();
    table.string('time_spent').nullable();
    table.integer('effort_rating').nullable();
    table.integer('rating').nullable();
    table.jsonb('details').notNullable().defaultTo('{}');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('log_entries');
}