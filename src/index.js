import fs from 'node:fs/promises'
import module from 'node:module'
import os from 'node:os'
import path from 'node:path'

import { Bot, InputFile } from 'grammy'
import { isRequired } from '@gabrielrufino/is-required'
import puppeteer from 'puppeteer'

import { database } from './database.js'
import { logger } from './logger.js'
import { RequestRepository } from './repositories/request.repository.js'

const {
  BOT_TOKEN = isRequired({ param: 'BOT_TOKEN' })
} = process.env

const bot = new Bot(BOT_TOKEN)
const requestRepository = new RequestRepository({
  database
})
const require = module.createRequire(import.meta.url)
const { version } = require('../package.json')

bot.command('start', context => context.reply('Welcome to PDFfromLink! Send a link and receive the PDF.'))
bot.command('version', context => context.reply(version))
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

  await Promise.all([
    browser.close(),
    context.replyWithDocument(new InputFile(filePath, `${title}.pdf`)),
    requestRepository.create({ context: JSON.parse(JSON.stringify(context)) })
  ])

  logger.info({ context })
})

bot.start()
