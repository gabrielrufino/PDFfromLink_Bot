import { Bot } from 'grammy'

const {
    BOT_TOKEN
} = process.env

const bot = new Bot(BOT_TOKEN)

bot.command('start', context => context.reply('Welcome to PDFfromLink! Send a link and receive the PDF.'))
bot.on('message', async context => {
    context.reply('Soon')
})

bot.start().then(() => console.log('Bot running'))
