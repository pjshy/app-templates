const semver = require('semver')
const inrequirer = require('inquirer')
const path = require('path')
const fs = require('fs')

const pkg = require('../package.json')

function checkNodeVersion (version, name) {
  if (!semver.satisfies(process.version, version)) {
    console.error('The node in your computed is: ' + process.version + '; but Node ' + pkg.engines.node + ' is required by ' + name)
    process.exit(1)
  }
}

// checkNodeVersion(pkg.version, pkg.name)

const questions = [
  {
    message: 'project name: ',
    type: 'input',
    default: 'app-template',
    name: 'name',
  },
  {
    message: 'version: ',
    type: 'string',
    default: '1.0.0',
    name: 'version',
  },
  {
    message: 'author: ',
    type: 'string',
    default: '',
    name: 'author'
  },
]

function copyFolder (source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target)
  }

  
}

inrequirer.prompt(questions).then((answers) => {
  const targetPath = process.cwd()
  const templatePath = path.join(__dirname, '../template')

  const fileState = fs.statSync(targetPath)

  if (fileState.isFile || fileState.isDirectory) {
    console.error(`The targer path <${ targetPath }> already exits.`)
    process.exit(1)
  }

})