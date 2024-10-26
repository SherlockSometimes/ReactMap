/* eslint-disable no-unused-vars */
const config = require('@rm/config')
const { log, TAGS } = require('@rm/logger')

/**
 * @param {import("knex").Knex} knex
 */
exports.up = async (knex) =>
  knex.schema
    .hasTable(config.getSafe('database.settings.userTableName'))
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable(
          config.getSafe('database.settings.userTableName'),
          (table) => {
            table.string('id')
          },
        )
      }
      log.warn(
        TAGS.db,
        `${config.getSafe(
          'database.settings.userTableName',
        )} already exists in your db, you may need to choose a new name in the config file.`,
      )
    })

/**
 * @param {import("knex").Knex} knex
 */
exports.down = (knex) =>
  knex.schema.dropTableIfExists(
    config.getSafe('database.settings.userTableName'),
  )
