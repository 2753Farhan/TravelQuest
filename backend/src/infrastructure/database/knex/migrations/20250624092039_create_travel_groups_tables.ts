import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('notifications', (table) => {
      table.uuid('notification_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable();
      table.enum('type', ['proximity', 'match', 'trip_update', 'message', 'invitation']).notNullable();
      table.string('title').notNullable();
      table.text('content').notNullable();
      table.string('related_entity_type');
      table.uuid('related_entity_id');
      table.boolean('is_read').notNullable().defaultTo(false);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      
      table.foreign('user_id').references('id').inTable('users');
      table.index(['user_id', 'is_read']);
      table.index(['created_at']);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('notifications');
}