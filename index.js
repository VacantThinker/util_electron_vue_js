'use strict';

const path = require('path');
const fs = require('fs');

/**
 *
 * @param nameDir {String}
 */
function deleteDir(nameDir) {
  const fs = require('fs');
  const path = require('path');
  const pathDir = path.join(__dirname, nameDir);
  if (fs.existsSync(pathDir)) {
    fs.rmSync(pathDir, {
      recursive: true, force: true,
    });
  }
}

/**
 * read env file , eg: env.sh xxx.env
 *
 * @param filename path env file
 * @param logObj default: false
 * @returns {{}}
 */
function readEnvFile(filename, logObj = false) {
  const fs = require('fs');
  const path = require('path');
  let buffer = fs.readFileSync(path.join(filename));
  let textContent = buffer.toString();

  let split = textContent.split('\n');

  let reduce = split.filter((value) => {
    return value.trim().length > 0;
  }).reduce((map, value) => {
    let regexpKey = /.+(?=\=)/;
    let envKey = value.match(regexpKey)[0];
    let regexpVal = /(?<=\=).+/;
    let envVal = value.match(regexpVal)[0].replace(/\"/g, '');

    if (logObj) {
      console.log(`key=${envKey}\nvalue=${envVal}\n`);
    }

    map[envKey] = envVal;
    return map;
  }, {});

  if (logObj) {
    console.log('\nenvObject=\n', reduce);
  }

  return reduce;
}

function readPackageJson(pathTarget = 'package.json', logObj = false) {
  const fs = require('fs');
  const path = require('path');

  const path_package_json = path.join(pathTarget);
  const buffer = fs.readFileSync(path_package_json);
  const textContent = buffer.toString();

  const objPackageJson = JSON.parse(textContent);
  if (logObj) {
    console.log('object package.json --> \n', objPackageJson);
  }
  return objPackageJson;
}

/**
 * generate electron index.html
 *
 * just add
 *
 * <div id="app"></div>
 *
 * <script src="./renderer.js" type="module"></script>
 *
 *
 * @param title
 * @param pathTarget
 */
function setupElectron_index_html(
    title = 'index.html title',
    pathTarget = 'dist') {
  const indexHtmlContent =
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="./favicon.ico" rel="icon">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>${title}</title>
</head>
<body>
<div id="app"></div>
<script src="./renderer.js" type="module"></script>
</body>
</html>
`;
  const fs = require('fs');
  const path = require('path');
  const string_index_html = 'index.html';
  const path_index_html = path.join(pathTarget, string_index_html);
  fs.writeFileSync(path_index_html, '');
  fs.writeFileSync(path_index_html, indexHtmlContent);

}

/**
 * generate renderer.js
 *
 * read dir assets/ forEach()
 *
 * appendFile
 *
 *    import './assets/home-view-xxx.js'
 *
 * @param pathTarget {String}
 */
function setupElectron_renderer_js(pathTarget = 'dist') {
  const fs = require('fs');
  const path = require('path');
  const string_assets = 'assets';
  const string_renderer_js = 'renderer.js';
  const path_assets = path.join(pathTarget, string_assets);
  const path_renderer_js = path.join(pathTarget, string_renderer_js);

  fs.writeFileSync(path_renderer_js, '');
  const filenameList = fs.readdirSync(path_assets);
  filenameList.forEach((filename) => {
    const text = `import './${string_assets}/${filename}';\n`;
    fs.appendFileSync(path_renderer_js, text);
  });
}

function getPathParent(logPath = false) {
  const path = require('path');
  const pathRoot = process.cwd();
  const nameRoot = path.basename(pathRoot);
  const parent = pathRoot.replace(nameRoot, '');
  if (logPath){
    console.log(`path parent=${parent}`);
  }
  return parent;
}

/**
 * npm run build (vite build) -->
 *
 * generate electron index.html -->
 *
 * generate electron renderer.js -->
 *
 * if exists xxx-electron public/ rmSync() -->
 *
 * copy vue dist/ ==> xxx-electron public/ -->
 *
 * end
 *
 * @param title index.html title
 * @param dirNameElectron
 */
function setupVueToElectron(
    title = 'index.html title',
    dirNameElectron = `xxx-electron`) {
  execAsync(cmd.vite_build, () => {
    setupElectron_index_html(title);
    setupElectron_renderer_js();
    const fs = require('fs');
    const path = require('path');
    const parent = getPathParent();

    let src = path.join('dist');
    let dest = path.join(parent, dirNameElectron, 'public');
    if (fs.existsSync(dest)) {
      console.log(`dest exists --> rm ... ${dest}`);
      fs.rmSync(dest, {recursive: true, force: true});
    }

    console.log(`copy ... ${src}`);
    fs.cpSync(src, dest, {recursive: true, force: true});
    console.log(`end ... ${dest}`);
  });
}

function execSync(cmd) {
  console.log(`execSync() cmd=${cmd}`);
  require('child_process').execSync(cmd);
}

function npmCacheClean() {
  execSync(`npm cache clean --force `);
}

/**
 *
 * @param cmd
 * @param callback {Function}
 */
function execAsync(cmd = '', callback = null) {
  console.log(`cmd start=`, cmd);
  const coffeeProcess = require('child_process').exec(cmd);
  const std = {
    stdout: [],
    stderr: [],
    close: null,
  };
  coffeeProcess.stdout.on('data', (data) => {
    std.stdout.push(data);
    console.log(data);
  });
  coffeeProcess.stderr.on('data', (err) => {
    std.stderr.push(err);
    console.log(err);
  });
  coffeeProcess.on('close', (code) => {
    std.close = code;
    console.log(`cmd close=`, cmd);
    if (callback) {
      callback(std);
    }
  });
}

function npmInstall() {
  execSync(`npm install`);
}

function yarnInstall() {
  execSync(`npm install`);
}

function openDirElectronOutSquirrel() {
  const path = require('path');
  const path_x64 = path.join('out', 'make', 'squirrel.windows', 'x64');
  const cmd = `start "o" ${path_x64}`;
  execAsync(cmd);
}

const cmd = {
  vite_build: `npm run build`,
};

module.exports = {
  setupVueToElectron: setupVueToElectron,
  setupElectron_index_html: setupElectron_index_html,
  setupElectron_renderer_js:setupElectron_renderer_js,

  cmd: cmd,

  readEnvFile: readEnvFile,
  readPackageJson: readPackageJson,

  execSync: execSync,
  execAsync: execAsync,
  openDirElectronOutSquirrel: openDirElectronOutSquirrel,

  npmCacheClean: npmCacheClean,
  npmInstall: npmInstall,
  yarnInstall: yarnInstall,
};