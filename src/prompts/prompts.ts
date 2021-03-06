import { prompt } from 'enquirer'

export async function inputOne(): Promise<any> {
  return await prompt({
    type: 'numeral',
    name: 'id',
    message: 'What chapter do you want to download?',
  })
}

export async function inputRange(): Promise<any> {
  return await prompt([
    {
      type: 'numeral',
      name: 'start',
      message: 'What chapter do you want to start at?',
    },
    {
      type: 'numeral',
      name: 'end',
      message: 'What chapter do you want to end at?',
    },
  ])
}

export async function confirmAll(): Promise<any> {
  return await prompt({
    type: 'confirm',
    name: 'resp',
    message: 'Are you sure you want to download all chapters?',
  })
}

export async function inputLatest(): Promise<any> {
  return await prompt({
    type: 'numeral',
    name: 'id',
    message: "What is the latest chapter you've read?",
  })
}
