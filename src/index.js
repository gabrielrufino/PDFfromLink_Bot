import { Bot } from 'grammy'
import { isRequired } from '@gabrielrufino/is-required'

import { message } from './listeners/message.js'
import { start } from './commands/start.js'
import { version } from './commands/version.js'

const {
  BOT_TOKEN = isRequired({ param: 'BOT_TOKEN' })
} = process.env

const bot = new Bot(BOT_TOKEN)

bot.command('start', start)
bot.command('version', version)
bot.on('message', message)

bot.start()
