const inrequirer = require('inquirer')
const path = require('path')
const fs = require('fs')

const pkg = require('../package.json')

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

  const fileState = fs.statSync(source)

  if (fileState.isDirectory()) {
    const files = fs.readdirSync(source)

    files.forEach((file) => {
      const currentSource = path.join(source, file)
      const currentTarget = path.join(target, file)

      if (fs.statSync(currentSource).isDirectory()) {
        copyFolder(currentSource, currentTarget)
      } else {
        fs.writeFileSync(currentTarget, fs.readFileSync(currentSource))
      }
    })
  }
}

inrequirer.prompt(questions).then((answers) => {
  const targetPath = path.join(process.cwd(), answers.name)
  const templatePath = path.join(__dirname, '../template')

  if (fs.existsSync(targetPath)) {
    console.error(`The targer path <${ targetPath }> already exits.`)
    process.exit(1)
  }

  copyFolder(templatePath, targetPath)

  const pkgPath = path.join(targetPath, 'package.json')
  const templatePkg = require(pkgPath)

  Object.assign(templatePkg, answers)

  fs.writeFileSync(pkgPath, JSON.stringify(templatePkg, null, 2))

  console.info('success!')
})