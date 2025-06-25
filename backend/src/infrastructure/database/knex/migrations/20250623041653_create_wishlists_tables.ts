import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wishlists', (table) => {
    table.uuid('wishlist_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.enum('visibility', ['public', 'private', 'friends_only']).notNullable().defaultTo('public');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

  await knex.schema.createTable('wishlist_items', (table) => {
    table.uuid('item_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('wishlist_id').notNullable().references('wishlist_id').inTable('wishlists').onDelete('CASCADE');
    table.uuid('place_id').references('place_id').inTable('places').onDelete('SET NULL');
    table.enum('priority', ['low', 'medium', 'high']).notNullable();
    table.string('target_season');
    table.integer('notification_radius').defaultTo(500);
    table.boolean('is_active').defaultTo(true);
    table.jsonb('details').defaultTo('{}');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

  await knex.schema.raw(`
    CREATE OR REPLACE FUNCTION update_wishlist_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER wishlists_timestamp
    BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION update_wishlist_timestamp();

    CREATE TRIGGER wishlist_items_timestamp
    BEFORE UPDATE ON wishlist_items
    FOR EACH ROW EXECUTE FUNCTION update_wishlist_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wishlist_items');
  await knex.schema.dropTable('wishlists');
}