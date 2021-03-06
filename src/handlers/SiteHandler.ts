import fs from 'fs'
import { s } from '../visible/rep'
import chalk from 'chalk'
import { safeAdd } from './ConfigHandler'

export let loadSites = async function () {
  let commands = []
  let add = await safeAdd()
  const siteFiles = fs
    .readdirSync('./sites/')
    .filter((i) => i.endsWith('.js') && !i.includes('example'))
  for (const file of siteFiles) {
    try {
      let site = await import(`../sites/${file}`)
      let cls = new site.default()
      await add(cls.name)
      commands.push(cls)
      console.log(chalk.green(s.p + `Loaded ${cls.name}`))
    } catch (e) {
      console.log(chalk.red(s.m + `Failed to load file ` + chalk.blue(file)))
    }
  }
  loadSites = async () => {
    return commands
  }
  return commands
}
