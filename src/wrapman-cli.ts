import { Command } from 'commander'
import { runIt } from 'src/utils/run-it'
import { Wrapman } from 'src/wrapman'

runIt({
  main: async () => {
    const program = new Command()

    program
      .name('wrapman')
      .version('0.0.1')
      .description(
        'Postman API request collection wrapper that generates an axios http client.',
      )

    program
      .command('flatten', { isDefault: true })
      .requiredOption(
        '-i, --input <file>',
        'the exported postman collection json file',
      )
      .option(
        '-d, --dest <destination>',
        'directory to output the JSON collection files to',
        '',
      )
      .action(async (options) => {
        const collection = await new Wrapman({
          collectionPath: options.input,
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
