/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions', (t) => {
    t.increments('id').primary().notNullable();
    t.integer('userid')
      .notNullable()
      .unique()
      .references('id')
      .inTable('users');
    t.integer('amount').notNullable();
    t.text('txid').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('transactions');
};
