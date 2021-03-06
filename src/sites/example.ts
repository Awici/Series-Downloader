import { BaseDownload } from '../models/base'
import cheerio from 'cheerio'
import TurndownService from 'turndown'

export default class TLDownload extends BaseDownload {
  constructor() {
    super('example', {
      name: 'Some example',
      baseURL: 'https://example.com/chapter/{id}/',
      lang: 'en',
      translator: 'Example',
      category: 'Example',
      groupName: 'Example',
      baseSavePath: 'Example',
      seriesName: 'Example',
      favorited: true,
    })
  }

  protected async parseData(): Promise<this> {
    let turndownService = new TurndownService()

    let $ = cheerio.load(this.data.rawData)
    // Whatever parsing logic
    // Can update `this.data.contents`
    // and `this.data.title`

    this.data.title = `# ${$('p[class=title]').text()}`
    let content = turndownService.turndown($('#contents').html()).trim()
    this.data.contents = content

    return this
  }
}
