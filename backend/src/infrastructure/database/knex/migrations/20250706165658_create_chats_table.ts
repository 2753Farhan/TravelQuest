import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chats', (table) => {
    table.uuid('chat_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('type').notNullable().checkIn(['group', 'direct', 'thread']);
    table.uuid('parent_id').references('chat_id').inTable('chats').onDelete('CASCADE');
    table.uuid('group_id').references('group_id').inTable('travel_groups').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 100);
    table.text('content');
    table.jsonb('details').notNullable().defaultTo('{}');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

  // Add complex check constraints with proper closing parenthesis and semicolon
  await knex.raw(`
    ALTER TABLE chats
    ADD CONSTRAINT valid_chat_type_check
    CHECK (
      (type = 'group' AND group_id IS NOT NULL AND user_id IS NULL) OR
      (type = 'direct' AND user_id IS NOT NULL AND group_id IS NULL) OR
      (type = 'thread' AND parent_id IS NOT NULL)
    );
  `);

  // Create indexes
  await knex.schema.alterTable('chats', (table) => {
    table.index(['group_id'], 'idx_chats_group_id', {
      predicate: knex.whereNotNull('group_id')
    });
    table.index(['user_id'], 'idx_chats_user_id', {
      predicate: knex.whereNotNull('user_id')
    });
    table.index(['parent_id'], 'idx_chats_parent_id', {
      predicate: knex.whereNotNull('parent_id')
    });
    table.index(['created_at'], 'idx_chats_created_at');
  });

  // Create timestamp update trigger
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_chat_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trigger_update_chat_timestamp
    BEFORE UPDATE ON chats
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER IF EXISTS trigger_update_chat_timestamp ON chats');
  await knex.raw('DROP FUNCTION IF EXISTS update_chat_timestamp');
  await knex.schema.dropTable('chats');
}