import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { MySqlDriver } from '@mikro-orm/mysql';
import * as mysql from 'mysql2/promise'

const DB_NAME = process.env.DB_NAME ?? 'teamtrack'
const DB_USER = process.env.DB_USER ?? 'root'
const DB_PASS = process.env.DB_PASS ?? 'Feli0901!'
const DB_HOST = process.env.DB_HOST ?? 'localhost'
const DB_PORT = Number(process.env.DB_PORT ?? 3306)

// ensure database exists before initializing MikroORM
try {
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, port: DB_PORT })
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
  await conn.end()
} catch (e) {
  // rethrow with clearer message
  console.error('Could not create or connect to MySQL server:', e)
  throw e
}

const clientUrl = `mysql://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  dbName: DB_NAME,
  driver: MySqlDriver,
  clientUrl,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  /*
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema()
}