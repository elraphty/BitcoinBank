/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema.createTable('transactionlogs', (t) => {
      t.increments('id').primary().notNullable();
      t.integer('userid')
        .notNullable()
        .references('id')
        .inTable('users');
      t.float('amount').notNullable();
      t.text('txid').notNullable().unique();
      t.enum('type', ['send', 'receive']).notNullable();
      t.enum('status', [1, 0]).notNullable().defaultTo(0);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('transactionlogs');
  };
  