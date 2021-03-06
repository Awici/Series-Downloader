import arg from 'arg'
import consola from 'consola'

export const args = arg(
  {
    '--help': Boolean,
    '--new': Boolean,
    '--failed': Boolean,
    '--favorited': Boolean,

    '-h': '--help',
    '-n': '--new',
    '-f': '--failed',
    '-u': '--favorited',
  },
  {
    permissive: true,
  }
)

export async function showHelp(): Promise<void> {
  consola.info({
    message: `A nice and fast, modular program to download web novels from wherever
        Without arguments will start as interactive

        By default will download to current directory
        
        Arguments:

        --help        -h       Shows this message
        --new         -n       Doesn't start as interactive and just downloads new chapters
        --failed      -f       Tries to downloads all the failed chapters
        --favorited   -u       Downloads all new and failed chapters from series that have been favorited
        `,
    badge: true,
  })
  process.exit(0)
}
