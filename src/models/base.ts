import fs from 'fs'
import got from 'got'
import ora from 'ora'
import { Data, SiteSettings } from './interface'

export abstract class BaseDownload {
  name: string
  settings: SiteSettings
  data: Data

  constructor(name: string, settings: SiteSettings) {
    this.name = name
    this.settings = settings
    this.data = {}
  }

  protected abstract parseData(): Promise<this>

  public async download(id: number, newSpinner: boolean = true): Promise<void> {
    this.data.id = id
    this.settings.savePath = `${this.settings.baseSavePath}/${this.data.id}.md`
    this.data.url = this.settings.baseURL.replace('{id}', id.toString())

    let spinner = ora(`Reading chapter: ${this.data.id}`).start()

    return new Promise(async (resolve, reject) => {
      await this.downloadPrivate()
        .then(() => {
          if (newSpinner) {
            spinner.succeed(`Downloaded chapter: ${this.data.id}`)
          } else {
            // Clears the spinner
            spinner.stop()
          }
          resolve()
        })
        .catch((e) => {
          spinner.fail(e)
          reject(this.data.url)
        })
    })
  }

  protected async downloadPrivate(): Promise<this> {
    return new Promise(async (resolve, reject) => {
      await this.downloadRawData().catch(() =>
        reject(`Error reading ${this.data.id}`)
      )
      if (this.data.valid) {
        await this.parseData()
        await this.writeToFile().catch(() =>
          reject(`Error writing chapter ${this.data.id} to a file`)
        )
        resolve(this)
      } else {
        reject(`Chapter (${this.data.id}) doesn't exist`)
      }
    })
  }

  protected async downloadRawData(): Promise<this> {
    try {
      const resp = await got(this.data.url)
      if (resp.statusCode === 404) {
        this.data.valid = false
      } else {
        this.data.rawData = resp.body
        this.data.valid = true
      }
    } catch (e) {
      throw new Error(e)
    }

    return this
  }

  protected async writeToFile(): Promise<this> {
    const totalContents = (this.data.title || '') + this.data.contents + '\n\n'

    fs.writeFile(this.settings.savePath, totalContents, (e) => {
      if (e) throw e
    })
    return this
  }
}
