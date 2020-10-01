#!/usr/bin/env node

const { spawn } = require("child_process");
const fs = require("fs");

const yargs = require('yargs');

const argv = yargs
    .option('template', {
        alias: 't',
        description: 'Template to use for the new app',
        type: 'string',
        required: true,
    })
    .help()
    .alias('help', 'h')
    .argv;

let folderName = '.';

if (argv._.length >= 1) {
  folderName = argv._[0];
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
    console.log(`Created folder: ${folderName}`);
  }
}

const templateUrls = {
  battle: 'https://github.com/luke10x/battle/tree/main'
}
if (templateUrls[argv.template] === undefined) {
    console.error("template must be one of these:", Object.keys(templateUrls).join(", "))
    process.exit(-1);
}
const repoUrl = templateUrls[argv.template];

const fetch = spawn("fetcher", [
  `--url=${repoUrl}`,
  `--out=${folderName}`
]);

fetch.on("close", code => {
  if (code !== 0) {
    console.error("cloning the template failed!")
    process.exit(code);
  } else {
    console.log("10x app installed! 👍");
  }
});
