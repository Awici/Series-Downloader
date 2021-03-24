import Conf from 'conf'
import { Config, Failed, Series } from '../models/interface'

const config = new Conf()

export async function setKey(key: string, item: any) {
  config.set(key, item)
}

export async function getKey(key: string): Promise<any> {
  return config.get(key)
}

async function loadConfigPrivate(): Promise<Config> {
  let failed: Failed[] = (await getKey('failed')) || []
  let masterSavePath: string = (await getKey('masterSavePath')) || '~'
  let series: Series[] = await getKey('series')

  return {
    failed,
    masterSavePath,
    series,
  }
}

export let loadConfig = async (): Promise<Config> => {
  let config: Config = await loadConfigPrivate()
  loadConfig = async () => {
    return config
  }
  return config
}

export async function addFailed(failed: Failed): Promise<void> {
  let previousFail = (await getKey('failed')) || []
  if (
    !previousFail.find(
      (f: Failed) => JSON.stringify(f) === JSON.stringify(failed)
    )
  ) {
    await setKey('failed', [...previousFail, failed])
  }
}

export async function removeFailed(failed: Failed): Promise<void> {
  let previousFail: Failed[] = (await getKey('failed')) || []
  let newList = previousFail.filter((i) => {
    i !== failed
  })
  await setKey('failed', newList)
}

export async function addSeries(series: Series): Promise<void> {
  let previousSeries = await getKey('series')
  await setKey('series', [...previousSeries, series])
}

export const safeAdd = async (): Promise<Function> => {
  let loaded: boolean
  let previousSeries: Series[]
  let allSeries: Series[]
  return async (seriesName: string) => {
    if (!loaded) {
      loaded = true
      previousSeries = (await getKey('series')) || []

      allSeries = [...(allSeries || []), ...previousSeries]
    }

    const serieExist = allSeries.find((s: Series) => s.name === seriesName)
    if (!serieExist) {
      allSeries.push({ name: seriesName, lastRead: 0 })
      await setKey('series', allSeries)
    }
  }
}

export async function setLatest(name: string, id: number): Promise<void> {
  let allSeries: Series[] = await getKey('series')
  let series: Series = allSeries.find((i) => i.name === name)
  let seriesIndex = allSeries.indexOf(series)
  series.lastRead = id
  allSeries[seriesIndex] = series
  await setKey('series', allSeries)
}
