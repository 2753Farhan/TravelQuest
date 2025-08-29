import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('travel_groups', (table) => {
      table.uuid('group_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('creator_id').notNullable();
      table.string('title').notNullable();
      table.date('start_date');
      table.date('end_date');
      table.enum('status', ['planning', 'active', 'completed', 'cancelled']).notNullable().defaultTo('planning');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at');
      table.foreign('creator_id').references('id').inTable('users');
    })
    
    .createTable('trip_members', (table) => {
      table.uuid('membership_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('trip_id').notNullable();
      table.uuid('user_id').notNullable();
      table.enum('role', ['organizer', 'planner', 'member']).notNullable().defaultTo('member');
      table.string('invitation_status').notNullable().defaultTo('pending');
      table.jsonb('invitation_details').defaultTo('{}');
      table.timestamp('joined_at');
      
      table.foreign('trip_id').references('group_id').inTable('travel_groups').onDelete('CASCADE');
      table.foreign('user_id').references('id').inTable('users');
      table.unique(['trip_id', 'user_id']);
    })
    
    .createTable('trip_items', (table) => {
      table.uuid('item_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('group_id').notNullable();
      table.uuid('place_id');
      table.uuid('transport_id');
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time').notNullable();
      table.date('date');
      table.enum('status', ['proposed', 'confirmed', 'rejected']).notNullable().defaultTo('proposed');
      table.jsonb('votes').defaultTo('{}');
      table.uuid('added_by').notNullable();
      table.jsonb('details').defaultTo('{}');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at');
      
      table.foreign('group_id').references('group_id').inTable('travel_groups').onDelete('CASCADE');
      table.foreign('place_id').references('place_id').inTable('places');
      table.foreign('transport_id').references('route_id').inTable('transport_routes');
      table.foreign('added_by').references('id').inTable('users');
      
      table.index(['group_id', 'status']);
      table.index(['start_time', 'end_time']);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('trip_items')
    .dropTableIfExists('trip_members')
    .dropTableIfExists('travel_groups');
}