import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { InputFile } from 'grammy'

import { RequestRepository } from '../repositories/request.repository.js'
import { browser } from '../browser.js'
import { database } from '../database.js'
import { logger } from '../logger.js'

const requestRepository = new RequestRepository({
  database
})

export const message = async context => {
  const { text } = context.message

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
    page.close(),
    context.replyWithDocument(document),
    requestRepository.create({ context: JSON.parse(JSON.stringify(context)) })
  ])

  logger.info({ context })
}
