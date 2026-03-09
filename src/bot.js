import { solveSituation } from './solver.js'
import { disclaimer } from './disclaimer.js'
import { getSession, touchSession } from './sessionStore.js'

const MAX_LEN = 4000 // частый безопасный лимит для описания сложной ситуации

export function registerBotHandlers(bot, log) {
  bot.start(async (ctx) => {
    await ctx.reply(
      'Опишите ситуацию, и я предложу взвешенное решение.'
    )
  })

  bot.on('text', async (ctx) => {
    const text = ctx.message.text?.trim() || ''

    if (!text) return

    if (text.length > MAX_LEN) {
      await ctx.reply('Текст слишком длинный. Сократите описание.')
      return
    }

    const session = getSession(ctx.from.id)
    touchSession(ctx.from.id)

    try {
      const result = solveSituation(text, { lang: detectLang(text) })
      await ctx.reply(result + '\n\n' + disclaimer(result.lang))
    } catch (e) {
      log.error(e)
      await ctx.reply('Произошла ошибка обработки.')
    }
  })
}

function detectLang(text) {
  return /[a-zA-Z]/.test(text) ? 'en' : 'ru'
}