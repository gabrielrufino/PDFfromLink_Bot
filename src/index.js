import { isRequired } from '@gabrielrufino/is-required';
import { Bot } from 'grammy';

import { start } from './commands/start.js';
import { version } from './commands/version.js';
import { message } from './listeners/message.js';

const {
  BOT_TOKEN = isRequired({ param: 'BOT_TOKEN' }),
} = process.env;

const bot = new Bot(BOT_TOKEN);

bot.command('start', start);
bot.command('version', version);
bot.on('message', message);

bot.start();
