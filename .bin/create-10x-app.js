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
  battle: 'https://github.com/luke10x/10x-app-templates/battle#main'
}
if (templateUrls[argv.template] === undefined) {
    console.error(
      "template must be one of these:",
      Object.keys(templateUrls)
        .map(name => `"${name}"`)
        .join(", "),
      `(but it was: "${argv.template}")`
    )
    process.exit(-1);
}
const repoUrl = templateUrls[argv.template];

console.log("🤖 creating app using 10x template: ", require("../package").version);

const fetch = spawn("degit", [
  repoUrl,
  folderName
]);

fetch
  .on("close", code => {
    if (code !== 0) {
      console.error("cloning the template failed!")
      process.exit(code);
    } else {
      console.log("10x app created! 👍");
    }
  });
