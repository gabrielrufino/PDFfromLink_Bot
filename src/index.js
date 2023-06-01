import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { Bot, InputFile } from 'grammy'
import { isRequired } from '@gabrielrufino/is-required'
import puppeteer from 'puppeteer'

import { database } from './database.js'
import { logger } from './logger.js'
import { start } from './commands/start.js'
import { version } from './commands/version.js'
import { RequestRepository } from './repositories/request.repository.js'

const {
  BOT_TOKEN = isRequired({ param: 'BOT_TOKEN' })
} = process.env

const bot = new Bot(BOT_TOKEN)
const requestRepository = new RequestRepository({
  database
})

bot.command('start', start)
bot.command('version', version)
bot.on('message', async context => {
  const { text } = context.message

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.goto(text, {
    waitUntil: 'networkidle0'
  })

  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'pdffromlink-'))
  const filePath = path.join(folder, 'file.pdf')
  await page.pdf({ path: filePath })

  const title = await page.title()
  const document = new InputFile(filePath, `${title}.pdf`)

  await Promise.all([
    browser.close(),
    context.replyWithDocument(document),
    requestRepository.create({ context: JSON.parse(JSON.stringify(context)) })
  ])

  logger.info({ context })
})

bot.start()
