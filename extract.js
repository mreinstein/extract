#!/usr/bin/env node

'use strict'

const { PNG }       = require('pngjs')
const chalk         = require('chalk')
const fs            = require('fs')
const getDimensions = require('./extract-dimensions')
const minimist      = require('minimist')
const path          = require('path')


function printGeneralUsage () {
    console.log('Generate a series of images given a bounding rectangle and input frames.')
    console.log(`\n  ${chalk.whiteBright.bold('extract')} ${chalk.dim('[options]')}\n`);
    console.log(chalk.dim('  Options:\n'))
    console.log(`    --input=${chalk.underline.bold.whiteBright('DIR')}     input directory containing input frames`)
    console.log(`    --length=${chalk.underline.bold.whiteBright('length')}     number of input frames`)
    console.log(' ')
}


async function main () {
  const argv = minimist(process.argv.slice(2))

  if (!argv.input || !argv.length) {
    printGeneralUsage()
    process.exit()
  }

  const inputPath = path.resolve(argv.input)

  const length = parseInt(argv.length, 10)

  const mode = (argv.x !== undefined && argv.y !== undefined && argv.width && argv.height) ? 'direct' : 'auto'

  let dimensions
  if (mode === 'auto')
    dimensions = await getDimensions(inputPath, 'in_', length)
  else {
    dimensions = {
      width: parseInt(argv.width, 10),
      height: parseInt(argv.height, 10),
      x: parseInt(argv.x, 10),
      y: parseInt(argv.y, 10)
    }
  }

  console.log(mode, dimensions)

  const { x, y, width, height } = dimensions

  for (let i=0; i < length; i++) {
    const paddedIdx =  i < 10 ? '0' + i : i

    fs.createReadStream(`${inputPath}/in_${paddedIdx}.png`)
      .pipe(new PNG())
      .on('parsed', function () {
        const sx = x
        const sy = y
        const dx = 0
        const dy = 0

        const dst = new PNG({ width, height })
        this.bitblt(dst, sx, sy, width, height, dx, dy)

        dst.pack().pipe(fs.createWriteStream(`${inputPath}/out_${paddedIdx}.png`))
      })
  }
}


main()
