import chalk from 'chalk'
import { args, showHelp } from '../handlers/ArgHandler'
import { loadConfig } from '../handlers/ConfigHandler'
import { s } from './rep'

const log = console.log

export async function startShow() {
  log(chalk.red(`==[ Series Downloader ]==`))
  log('\n\n\n')
  const command = Object.keys(args)[1]
  switch (command) {
    case '--help':
      await showHelp()
      break
    case '--favorited':
      await favorited()
      break
    case '--new':
      await newChapters()
      break
    case '--failed':
      await failedChapters()
      break
    default:
      log(chalk.green(`${s.p} Starting in interactive mode`))
  }
}

async function newChapters() {
  log(chalk.green(`${s.p} Will download all new chapters!`))
}

async function favorited() {
  log(chalk.green(`${s.p} Will download all new chapters for favorited series`))
}

async function failedChapters() {
  const config = await loadConfig()
  if (!config.failed) return
  if (config.failed.length > 0) {
    log(
      chalk.green(
        `${s.p} Will download all failed chapters!\nHeres a shortlist below!`
      )
    )
    for (const item of config.failed) {
      log(
        chalk.red(`-> ${chalk.bold(item.name)} ` + chalk.yellow.italic(item.id))
      )
    }
  } else {
    log(chalk.green(`${s.p} It seems there aren't any failed chapters!`))
  }
}
