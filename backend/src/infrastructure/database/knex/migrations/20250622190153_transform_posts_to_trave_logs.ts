import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('posts', 'travel_logs');

  await knex.schema.alterTable('travel_logs', (table) => {
    table.renameColumn('id', 'log_id');
    table.renameColumn('user_id', 'creator_id');
    table.renameColumn('content', 'description');
    table.renameColumn('started_at', 'start_date');
    table.renameColumn('end_at', 'end_date');
    
    table.enum('visibility', ['public', 'private', 'friends_only'])
      .notNullable()
      .defaultTo('public');
    table.enum('status', ['planning', 'active', 'completed', 'cancelled'])
      .notNullable()
      .defaultTo('planning');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('travel_logs', (table) => {
    table.renameColumn('log_id', 'id');
    table.renameColumn('creator_id', 'user_id');
    table.renameColumn('description', 'content');
    table.renameColumn('start_date', 'started_at');
    table.renameColumn('end_date', 'end_at');
    table.dropColumn('visibility');
    table.dropColumn('status');
  });
  
  await knex.schema.renameTable('travel_logs', 'posts');
}