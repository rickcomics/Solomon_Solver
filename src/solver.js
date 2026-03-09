// Rule-based «Соломоново» решение
// Блок легко заменить на LLM позже

export function solveSituation(text, { lang }) {
  const parties = extractParties(text)
  const interests = extractInterests(text)
  const risks = estimateRisks(text)
  const compromise = buildCompromise(parties, interests, risks)

  if (lang === 'en') {
    return formatEN(parties, interests, risks, compromise)
  }
  return formatRU(parties, interests, risks, compromise)
}

function extractParties(text) {
  const hints = ['я', 'он', 'она', 'мы', 'они', 'коллег', 'друг', 'семь', 'клиент']
  const found = hints.filter(h => text.toLowerCase().includes(h))
  return found.length ? found : ['стороны ситуации']
}

function extractInterests(text) {
  return 'Вероятные интересы сторон: безопасность, справедливость, сохранение отношений, результат.'
}

function estimateRisks(text) {
  return 'Риски крайних решений: эскалация конфликта, потеря доверия, долгосрочные издержки.'
}

function buildCompromise(parties, interests, risks) {
  return 'Компромисс: решение, которое частично удовлетворяет интересы сторон, минимизируя общий вред и оставляя пространство для пересмотра.'
}

function formatRU(p, i, r, c) {
  return (
`🧭 Взвешенный разбор

` +
`Стороны: ${p.join(', ')}
` +
`${i}
` +
`${r}

` +
`⚖️ Мудрое решение:
${c}`)
}

function formatEN(p, i, r, c) {
  return (
`🧭 Balanced analysis

` +
`Parties: ${p.join(', ')}
` +
`Likely interests: safety, fairness, preserving relationships, outcomes.
` +
`Risks of extreme options: conflict escalation, trust loss, long-term costs.

` +
`⚖️ Wise resolution:
A compromise that partially satisfies each side while minimizing total harm and keeping room for revision.`)
}