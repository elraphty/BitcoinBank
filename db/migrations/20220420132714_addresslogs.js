/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema.createTable('addresslogs', (t) => {
      t.increments('id').primary().notNullable();
      t.integer('userid')
        .notNullable()
        .references('id')
        .inTable('users');
      t.text('receiveaddress').notNullable().unique();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('addresslogs');
  };