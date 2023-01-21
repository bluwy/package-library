import fs from 'node:fs'
import path from 'node:path'

// recursively rename all .js files in dist to .cjs
renameJsToCjs(path.resolve('dist'))

function renameJsToCjs(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true })

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      renameJsToCjs(path.join(dir, dirent.name))
    } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
      const oldPath = path.join(dir, dirent.name)
      const newPath = path.join(dir, dirent.name.replace('.js', '.cjs'))
      fs.renameSync(oldPath, newPath)
    }
  }
}
