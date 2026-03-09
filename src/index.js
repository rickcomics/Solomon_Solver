import 'dotenv/config'
import expressPkg from 'express'
const express = expressPkg
import helmet from 'helmet'
import pino from 'pino'
import { Telegraf } from 'telegraf'
import { registerBotHandlers } from './bot.js'

const log = pino({ level: 'info' })
const app = express()
app.use(helmet())
app.use(express.json({ limit: '32kb' }))

const PORT = process.env.PORT || 3000
const BOT_TOKEN = process.env.BOT_TOKEN
const WEBHOOK_URL = process.env.WEBHOOK_URL

if (!BOT_TOKEN) {
  log.error('BOT_TOKEN missing')
  process.exit(1)
}

const bot = new Telegraf(BOT_TOKEN)
registerBotHandlers(bot, log)

app.get('/', (_, res) => res.send('OK'))

app.use(bot.webhookCallback('/tg'))

app.listen(PORT, async () => {
  log.info(`Server started on :${PORT}`)
  if (WEBHOOK_URL) {
    await bot.telegram.setWebhook(`${WEBHOOK_URL}/tg`)
    log.info('Webhook set')
  } else {
    log.warn('WEBHOOK_URL not set (dev mode?)')
  }
})