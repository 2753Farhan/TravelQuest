import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', (table) => {
    table.timestamp('started_at')
      .nullable()
      .comment('When the post activity begins');
    
    table.timestamp('end_at')
      .nullable()
      .comment('When the post activity ends');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', (table) => {
    table.dropColumn('started_at');
    table.dropColumn('end_at');
  });
}