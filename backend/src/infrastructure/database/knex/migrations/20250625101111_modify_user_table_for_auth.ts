import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add new nullable columns if they don't exist
  const columnsToAdd = [
    { name: 'username', type: 'string' },
    { name: 'password_hash', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'profile_pic_url', type: 'string' },
    { name: 'bio', type: 'text' },
    { name: 'preferences', type: 'jsonb' },
    { name: 'is_verified', type: 'boolean' },
    { name: 'refresh_token', type: 'string' },
    { name: 'last_login_at', type: 'timestamp' }
  ];

  for (const column of columnsToAdd) {
    if (!(await knex.schema.hasColumn('users', column.name))) {
      await knex.schema.alterTable('users', (table) => {
        if (column.type === 'string') table.string(column.name).nullable();
        if (column.type === 'text') table.text(column.name).nullable();
        if (column.type === 'boolean') table.boolean(column.name).nullable();
        if (column.type === 'jsonb') table.jsonb(column.name).nullable();
        if (column.type === 'timestamp') table.timestamp(column.name).nullable();
      });
    }
  }

  // Backfill data for existing records - handled separately for each column type
  await knex.raw(`
    UPDATE users SET 
      username = COALESCE(username, 'user_' || id::text),
      password_hash = COALESCE(password_hash, 'temp-hash-' || id::text),
      role = COALESCE(role, 'traveler'),
      is_verified = COALESCE(is_verified, true),
      preferences = COALESCE(preferences, '{}'::jsonb)
  `);

  // Modify columns to be NOT NULL
  await knex.schema.alterTable('users', (table) => {
    table.string('username').notNullable().alter();
    table.string('password_hash').notNullable().alter();
    table.string('role').notNullable().alter();
    table.boolean('is_verified').notNullable().alter();
    table.jsonb('preferences').notNullable().alter();
  });

  // Add role constraint if it doesn't exist
  const roleConstraintExists = await knex.raw(`
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_role_check' 
    AND conrelid = 'users'::regclass
  `);

  if (!roleConstraintExists.rows.length) {
    await knex.raw(`
      ALTER TABLE users
      ADD CONSTRAINT users_role_check
      CHECK (role IN ('admin', 'moderator', 'traveler', 'explorer'))
    `);
  }

  // Add unique index on username if it doesn't exist
  const uniqueIndexExists = await knex.raw(`
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'users_username_unique' 
    AND tablename = 'users'
  `);

  if (!uniqueIndexExists.rows.length) {
    await knex.schema.alterTable('users', (table) => {
      table.unique(['username'], 'users_username_unique');
    });
  }

  // Add other indexes if they don't exist
  const indexesToAdd = [
    { name: 'idx_users_email', columns: ['email'] },
    { name: 'idx_users_username', columns: ['username'] },
    { name: 'idx_users_role', columns: ['role'] }
  ];

  for (const index of indexesToAdd) {
    const indexExists = await knex.raw(`
      SELECT 1 FROM pg_indexes 
      WHERE indexname = '${index.name}' 
      AND tablename = 'users'
    `);

    if (!indexExists.rows.length) {
      await knex.schema.alterTable('users', (table) => {
        table.index(index.columns, index.name);
      });
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  // Remove constraints if they exist
  await knex.raw(`
    ALTER TABLE users 
    DROP CONSTRAINT IF EXISTS users_role_check
  `);

  await knex.raw(`
    ALTER TABLE users 
    DROP CONSTRAINT IF EXISTS users_username_unique
  `);

  // Remove indexes if they exist
  const indexesToRemove = [
    'idx_users_email',
    'idx_users_username',
    'idx_users_role'
  ];

  for (const index of indexesToRemove) {
    await knex.raw(`
      DROP INDEX IF EXISTS ${index}
    `);
  }

  // Remove columns if they exist
  const columnsToRemove = [
    'username',
    'password_hash',
    'role',
    'profile_pic_url',
    'bio',
    'preferences',
    'is_verified',
    'refresh_token',
    'last_login_at'
  ];

  for (const column of columnsToRemove) {
    if (await knex.schema.hasColumn('users', column)) {
      await knex.schema.alterTable('users', (table) => {
        table.dropColumn(column);
      });
    }
  }
}