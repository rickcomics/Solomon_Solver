import { v4 as uuid } from 'uuid'

const store = new Map()
const TTL = 15 * 60 * 1000

export function getSession(userId) {
  if (!store.has(userId)) {
    store.set(userId, { id: uuid(), ts: Date.now() })
  }
  return store.get(userId)
}

export function touchSession(userId) {
  const s = getSession(userId)
  s.ts = Date.now()
}

setInterval(() => {
  const now = Date.now()
  for (const [k, v] of store.entries()) {
    if (now - v.ts > TTL) store.delete(k)
  }
}, 60_000)