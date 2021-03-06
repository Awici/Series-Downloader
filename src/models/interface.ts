export interface SiteSettings {
  name: string
  baseURL: string
  writer?: string
  savePath?: string
  baseSavePath?: string
  favorited?: boolean
  groupName?: string
  seriesName?: string
  category?: string
  lang?: string
  translator?: string
}

export interface Data {
  url?: string
  rawData?: string
  id?: number
  title?: string
  contents?: string | string[]
  valid?: boolean
}

export interface Config {
  failed: Failed[]
  series: Series[]
  masterSavePath: string
}

export interface Failed {
  name: string
  id: number
}

export interface Series {
  name: string
  lastRead: number
}
