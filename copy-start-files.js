import fs from 'fs-extra'

async function copyStartFolder() {
  try {
    await fs.copy('start', 'build/start')
    await fs.copy('package.json', 'build/package.json')
    console.log('Copied start folder, package.json')
  } catch (err) {
    console.error('Error copying files:', err)
  }
}

copyStartFolder()
