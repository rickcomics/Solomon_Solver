// Rule-based «Соломоново» решение
// Архитектура: классификация типа ситуации → профиль анализа → генерация решения
// Блок легко заменить на LLM позже

export function solveSituation(text, { lang }) {
  const type = classifySituation(text)

  const analysis =
    type === 'internal'
      ? analyzeInternal(text)
      : type === 'interpersonal'
      ? analyzeInterpersonal(text)
      : analyzeGeneric(text)

  if (lang === 'en') return formatEN(analysis)
  return formatRU(analysis)
}

// --- Классификация ---
function classifySituation(text) {
  const t = text.toLowerCase()

  const selfMarkers = ['я ', 'мне ', 'меня ', 'мой ', 'моя ', 'моё ', 'моих']
  const otherMarkers = ['он ', 'она ', 'они ', 'мы ', 'коллег', 'друг', 'семь', 'клиент', 'началь']

  const selfCount = selfMarkers.filter(m => t.includes(m)).length
  const otherCount = otherMarkers.filter(m => t.includes(m)).length

  if (selfCount > 0 && otherCount === 0) return 'internal'
  if (otherCount > 0) return 'interpersonal'
  return 'generic'
}
// --- Тип 1: Внутренний конфликт ---
function analyzeInternal(text) {
  const values = extractValueTensions(text)
  const habits = detectHabits(text)

  return {
    title: 'Взвешенный разбор',
    summary:
      'Это внутренний конфликт ценностей: разные части ваших приоритетов тянут в разные стороны.',
    bullets: [
      values,
      habits,
      'Крайние решения усиливают стресс: жёсткий запрет вызывает срыв, игнорирование последствий накапливает вред.'
    ],
    decision:
      'Компромисс через постепенность: сохранить полезную функцию привычки (пауза, снятие напряжения), но поэтапно снижать вред и заменять ритуал более безопасными альтернативами. Решение должно быть обратимым и измеримым.'
  }
}

function extractValueTensions(text) {
  const t = text.toLowerCase()
  const pairs = []

  if (/(удовольств|приятн)/.test(t)) pairs.push('Краткосрочное удовольствие')
  if (/(здоров|вред|самочувств)/.test(t)) pairs.push('Долгосрочное благополучие')
  if (/(привыч|образ жизни|ритуал)/.test(t)) pairs.push('Привычный образ жизни')
  if (/(измен|лучше|цель|развит)/.test(t)) pairs.push('Желаемые изменения и рост')
  if (/(нерв|стресс|тревог)/.test(t)) pairs.push('Способ снятия стресса')

  if (pairs.length < 2) return 'Вероятное напряжение между текущим комфортом и долгосрочными последствиями.'

  return 'Напряжение ценностей: ' + pairs.join(' ↔ ') + '.'
}

function detectHabits(text) {
  if (/(курен|сигарет|алкогол|кофе|игр|соцсет)/i.test(text)) {
    return 'Ситуация связана с привычкой и автоматическими сценариями поведения.'
  }
  return 'Заметны повторяющиеся поведенческие паттерны.'
}
// --- Тип 2: Межличностный конфликт ---
function analyzeInterpersonal(text) {
  const parties = extractParties(text)
  return {
    title: 'Взвешенный разбор',
    summary: 'Это конфликт интересов между сторонами.',
    bullets: [
      `Стороны: ${parties.join(', ')}.`,
      'Вероятные интересы: безопасность, справедливость, сохранение отношений, достижение результата.',
      'Риски крайних позиций: эскалация конфликта, потеря доверия, долгосрочные издержки.'
    ],
    decision:
      'Компромисс: решение, которое частично удовлетворяет интересы сторон, минимизируя общий вред и оставляя пространство для пересмотра договорённостей.'
  }
}

function extractParties(text) {
  const hints = ['я', 'он', 'она', 'мы', 'они', 'коллеги', 'друг', 'семья', 'клиент', 'начальник']
  const found = hints.filter(h => text.toLowerCase().includes(h))
  return found.length ? found : ['стороны ситуации']
}

// --- Тип 3: Общее решение ---
function analyzeGeneric(_) {
  return {
    title: 'Взвешенный разбор',
    summary: 'Ситуация требует выбора при неполной информации.',
    bullets: [
      'Полезно уточнить цели и ограничения.',
      'Крайности повышают риски и снижают гибкость.',
      'Обратимые шаги безопаснее необратимых.'
    ],
    decision:
      'Практичный компромисс: малые проверяемые шаги, наблюдение за эффектом, корректировка курса по результатам.'
  }
}

// --- Форматирование ---
function formatRU(a) {
  return (
`🧭 ${a.title}

` +
`${a.summary}
` +
`${a.bullets.map(b => '• ' + b).join('\n')}

` +
`⚖️ Мудрое решение:
${a.decision}`)
}

function formatEN(a) {
  return (
`🧭 Balanced analysis

` +
`${a.summary}
` +
`${a.bullets.map(b => '• ' + b).join('\n')}

` +
`⚖️ Wise resolution:
${a.decision}`)
}