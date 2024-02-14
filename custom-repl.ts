// noinspection ES6PreferShortImport

import lodash from 'lodash'
import path from 'node:path'
import repl from 'node:repl'
import { Wrapman } from 'src/wrapman'
import { WrapmanApiClient } from 'src/wrapman-api-client'
import wrapmanJson from './dist/wrapman.json'

console.log(new Date().toString())
console.log(`\n=== Custom REPL initialized ===\n`)

const r = repl.start('👾 > ')

// We have to manually set up persistent history for a custom repl instance.
r.setupHistory(path.join('.', '.custom_repl_history'), () => {})

// Auto-imports
// Define values on the REPL context to make them globally available

Object.defineProperty(r.context, 'lodash', {
  configurable: false,
  enumerable: true,
  value: lodash,
})

Object.defineProperty(r.context, 'wrapman', {
  configurable: false,
  enumerable: true,
  value: {
    Wrapman,
    WrapmanApiClient,
    wrapmanJson,
  },
})
