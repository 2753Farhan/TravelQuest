// migrations/20230707120000_modify_chat_constraints.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE chats 
    DROP CONSTRAINT IF EXISTS valid_chat_type_check;
    
    ALTER TABLE chats
    ADD CONSTRAINT valid_chat_type_check
    CHECK (
      -- Group chats must have group_id, may have user_id
      ((type = 'group'::text) AND (group_id IS NOT NULL)) OR
      
      -- Direct chats must have user_id and no group_id
      ((type = 'direct'::text) AND (user_id IS NOT NULL) AND (group_id IS NULL)) OR
      
      -- Thread messages must have parent_id
      ((type = 'thread'::text) AND (parent_id IS NOT NULL))
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE chats 
    DROP CONSTRAINT IF EXISTS valid_chat_type_check;
    
    ALTER TABLE chats
    ADD CONSTRAINT valid_chat_type_check
    CHECK (
      ((type = 'group'::text) AND (group_id IS NOT NULL) AND (user_id IS NULL)) OR
      ((type = 'direct'::text) AND (user_id IS NOT NULL) AND (group_id IS NULL)) OR
      ((type = 'thread'::text) AND (parent_id IS NOT NULL))
    );
  `);
}