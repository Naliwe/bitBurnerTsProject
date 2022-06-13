const { promises: fs, existsSync } = require('fs');

const btrFiles = [];

/**
 * @param {String} dir 
 */
async function getFiles(dir) {
  /** @type {String} filepath */
  const filepath = dir;
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.lstat(`${filepath}/${file}`);
    if (stat.isDirectory()) {
      await getFiles(`${filepath}/${file}`);
    } else if (file.endsWith('.js') && !/^Bitburner.t.+$/.test(file)) {
      btrFiles.push(`./${filepath.replace(/build\//, '')}/${file}`);
    }
  }
}

/**
 * @param {Boolean} verbose 
 */
async function main(verbose) {
  if (!existsSync('build/resources')) await fs.mkdir('build/resources');
  await getFiles('build');
  await fs.writeFile('build/resources/manifest.txt', btrFiles.join('\r\n').trimEnd());
  console.log('\x1b[32m Manifest generated \x1b[0m');
  if (verbose) console.log(btrFiles.join('\r\n').trimEnd());
}

if (require.main === module) {
  const input = process.argv;
  let verbose = false;
  for (let i = 2; i < input.length; i++) {
    if (input[ i ] === '--verbose' || input[ i ] === '-v') verbose = true;
  }

  main(verbose)
}