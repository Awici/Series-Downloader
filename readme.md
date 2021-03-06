# Series Downloader

## Purpose

I found it annoying to keep writing boilerplate logic for downloading web series so I made this.

It should work with only writing parsing logic for the site

## How to use

1. Clone this repo
2. Make sure node, yarn and typescript is installed
3. Add a file to `./src/sites/` with custom logic
4. Compile with `typescript`
5. Go and run `./dist/index.js`

## Writing custom parsing logic

1. Look at the example
2. Currently not all properties are needed but they might be in the future
3. Raw HTML is provided in `this.data.rawData`
4. Mutate `this.data.title` and/or `this.data.contents` based of your parsing logic
5. Make sure to `return this`
