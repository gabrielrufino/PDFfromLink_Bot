import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { Bot, InputFile } from 'grammy'
import puppeteer from 'puppeteer'

import { logger } from './logger.js'
import { isRequired } from './helpers/is-required.js'

const {
  BOT_TOKEN = isRequired('BOT_TOKEN')
} = process.env

const bot = new Bot(BOT_TOKEN)

bot.command('start', context => context.reply('Welcome to PDFfromLink! Send a link and receive the PDF.'))
bot.on('message', async context => {
  const { text } = context.message

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.goto(text)

  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'pdffromlink-'))
  const filePath = path.join(folder, 'file.pdf')
  await page.pdf({ path: filePath })

  const title = await page.title()

  await Promise.all([
    browser.close(),
    context.replyWithDocument(new InputFile(filePath, `${title}.pdf`))
  ])

  logger.info({ context })
})

bot.start()
