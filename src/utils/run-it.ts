import { round } from 'lodash'

interface RunItProps {
  main: () => Promise<any>
}

export function runIt({ main }: RunItProps) {
  const start = Date.now()

  let encounteredError = false

  main()
    .catch((err) => {
      encounteredError = true

      console.error(err)
    })
    .finally(() => {
      const end = Date.now()
      const duration = round((end - start) / 1000, 2)

      console.log(`\n✨  Done ${duration}s.`)

      process.exit(encounteredError ? 1 : 0)
    })
}
