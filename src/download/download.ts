import chalk from 'chalk'
import { loadConfig, removeFailed, setLatest } from '../handlers/ConfigHandler'
import { s } from '../visible/rep'

interface Range {
  final: number
  failed: number[]
}

export async function downloadOne(
  siteClass: any,
  id: number,
  newSpinner: boolean
): Promise<void> {
  id = Math.floor(id)
  await siteClass.download(id, newSpinner)
  await checkFailed(siteClass, id)
}

export async function downloadRange(
  siteClass: any,
  start: number,
  newSpinner: boolean,
  end?: number
): Promise<Range> {
  start = Math.floor(start)
  end = Math.floor(end)
  let currentChapter = start
  let endChapter = end || false
  let consecutiveFailed = 0
  let failed = []
  let latestReal = currentChapter

  while (
    consecutiveFailed < 2 &&
    (currentChapter <= endChapter || !endChapter)
  ) {
    await downloadOne(siteClass, currentChapter, newSpinner)
      .then(() => {
        latestReal = currentChapter
        if (consecutiveFailed === 1) failed.push(currentChapter - 1)
        currentChapter++
        consecutiveFailed = 0
      })
      .catch(() => {
        currentChapter++
        consecutiveFailed++
      })
  }
  return {
    final: latestReal,
    failed,
  }
}

export async function downloadNew(
  siteClass: any,
  latest?: number
): Promise<void> {
  let config = await loadConfig()

  latest =
    latest || config.series.find((i) => i.name === siteClass.name).lastRead
  let series = await downloadRange(siteClass, latest + 1, true)
  console.log(
    chalk.green(s.p + `Downloaded all new chapters for ${siteClass.name}`)
  )
  console.log(
    chalk.yellow.bold(latest) +
      chalk.green(' -> ') +
      chalk.blue.bold(series.final)
  )
  await setLatest(siteClass.name, series.final)
}

export async function downloadAll(siteClass: any): Promise<void> {
  let series = await downloadRange(siteClass, 1, true)
  console.log(
    chalk.green(s.m + `Downloaded all chapters found in ${siteClass.name}`)
  )
  console.log(
    chalk.yellow.bold('1') + chalk.green(' -> ') + chalk.blue.bold(series.final)
  )
  await setLatest(siteClass.name, series.final)
}

async function checkFailed(siteClass: any, id: number): Promise<void> {
  const config = await loadConfig()
  if (config.failed.filter((i) => i.name === siteClass.name && i.id === id)) {
    await removeFailed({ name: siteClass.name, id }).catch()
  }
}

export async function downloadFailed(siteClass: any): Promise<void> {
  const config = await loadConfig()
  const failed = config.failed.filter((i) => i.name === siteClass.name)
  for (let failure of failed) {
    await downloadOne(siteClass, failure.id, true)
  }
}
