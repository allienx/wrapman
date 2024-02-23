#!/usr/bin/env node

import { Command } from 'commander'
import { runIt } from 'src/utils/run-it'
import { Wrapman } from 'src/wrapman'

runIt({
  main: async () => {
    const program = new Command()

    program
      .name('wrapman')
      .version('1.0.4')
      .description(
        'API request collection wrapper that generates an axios http client.',
      )

    program
      .command('flatten', { isDefault: true })

      .requiredOption(
        '-i, --input <path>',
        'the path to the exported collection json',
      )
      .option('--url', 'treat the input path as a URL to fetch')
      .option(
        '-d, --dest <destination>',
        'directory to output the JSON collection files to',
        '',
      )
      .action(async (options) => {
        const collection = await new Wrapman({
          collectionPath: options.input,
          isPathUrl: !!options.url,
        }).flatten({
          destPath: options.dest,
        })

        if (!options.dest) {
          process.stdout.write(JSON.stringify(collection))
        }
      })

    await program.parseAsync(process.argv)
  },
})
