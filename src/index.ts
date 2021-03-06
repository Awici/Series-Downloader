import chalk from 'chalk'
import { prompt } from 'enquirer'
import {
  downloadAll,
  downloadFailed,
  downloadNew,
  downloadOne,
  downloadRange,
} from './download/download'
import { args } from './handlers/ArgHandler'
import { addFailed, loadConfig, setLatest } from './handlers/ConfigHandler'
import { loadSites } from './handlers/SiteHandler'
import {
  confirmAll,
  inputLatest,
  inputOne,
  inputRange,
} from './prompts/prompts'
import { s } from './visible/rep'
import { startShow } from './visible/start'

async function main(): Promise<void> {
  await startShow()
  const command = Object.keys(args)[1]
  if (command) {
    await interactiveCommands()
  } else {
    await menu()
  }
}

async function interactiveCommands(): Promise<void> {
  const sites = await loadSites()
  const command = Object.keys(args)[1]
  switch (command) {
    case '--favorited':
      for (const site of sites) {
        if (site.settings.favorited) {
          await downloadFailed(site)
          await downloadNew(site)
        }
      }
      break
    case '--new':
      for (const site of sites) {
        await downloadNew(site)
      }
      break
    case '--failed':
      for (const site of sites) {
        await downloadFailed(site)
      }
      break
    default:
      console.log(chalk.red(`${s.m} Thats odd. How did you get here?`))
  }
}

async function menu(): Promise<void> {
  const sites = await loadSites()
  const config = await loadConfig()
  console.log('\n\n')
  const siteNameShow = sites.map((si, i) => {
    const numFailedChap: number = config.failed
      ? config.failed.filter((f) => f === si.name).length
      : 0
    let temp = [
      chalk.blue(s.m),
      chalk.red.bold(si.name),
      si.settings.favorited ? chalk.red('❤️') : '',
      chalk.cyan(si.settings.lang || ''),
      chalk.magenta(si.settings.category || ''),
      chalk.yellow(`Latest: ${config.series[i].lastRead} `),
      chalk.red(`Failed: ${numFailedChap}`),
    ]
    return temp.join(' ')
  })

  siteNameShow.forEach((i) => console.log(i))
  console.log('\n\n')
  let series: any = await prompt([
    {
      type: 'select',
      name: 'name',
      message: 'Which series?',
      choices: sites.map((s) => s.name),
    },
    {
      type: 'select',
      name: 'option',
      message: 'What would you like to do?',
      choices: [
        'download one',
        'download a range',
        'download new',
        'download all',
        'download failed',
        'update latest read',
      ],
    },
  ])
  const currentSite = sites.find((si) => si.name === series.name)
  switch (series.option) {
    case 'download one': {
      const input = await inputOne()
      await downloadOne(currentSite, input.id, true)
        .then(async () => await setLatest(series.name, input.id))
        .catch(async () => addFailed({ name: series.name, id: input.id }))
      break
    }
    case 'download a range':
      {
        const input = await inputRange()
        let errors = await downloadRange(
          currentSite,
          input.start,
          true,
          input.end
        )
        console.log(
          chalk.green(s.p + `Downloaded from ${input.start} -> ${errors.final}`)
        )
        for (const failed of errors.failed) {
          await addFailed({ name: series.name, id: failed })
        }
      }
      break
    case 'download new':
      {
        await downloadNew(currentSite)
      }
      break
    case 'download all':
      {
        const input = await confirmAll()
        if (input.resp) downloadAll(currentSite)
      }
      break
    case 'download failed':
      {
        await downloadFailed(series)
      }
      break
    case 'update latest read':
      {
        const latest = await inputLatest()
        await setLatest(series.name, latest.id)
      }
      break
    default:
      console.log(chalk.red(s.m + 'It seems we ran into an issue'))
      break
  }
}
main()
