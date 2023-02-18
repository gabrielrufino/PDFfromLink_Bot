import { isRequired } from '@gabrielrufino/is-required'
import { MongoClient } from 'mongodb'

const {
  DATABASE_URI = isRequired({ param: 'DATABASE_URI' })
} = process.env

const client = new MongoClient(DATABASE_URI)
const database = client.db('pdffromlink_bot_db')

export { client, database }
