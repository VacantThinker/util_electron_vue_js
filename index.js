'use strict';

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
 * @param logIt default: false
 * @returns {{}}
 */
function readEnvFile(filename, logIt = false) {
  const fs = require('fs');
  const path = require('path');
  const buffer = fs.readFileSync(path.join(filename));
  const textContent = buffer.toString();

  const split = textContent.split('\n');

  const reduce = split.filter((value) => {
    return value.trim().length > 0;
  }).reduce((map, value) => {
    const regexpKey = /.+(?=\=)/;
    const envKey = value.match(regexpKey)[0];
    const regexpVal = /(?<=\=).+/;
    const envVal = value.match(regexpVal)[0].replace(/\"/g, '');

    if (logIt) {
      console.log(`key=${envKey}\nvalue=${envVal}\n`);
    }

    map[envKey] = envVal;
    return map;
  }, {});

  if (logIt) {
    console.log('\nenvObject=\n', reduce);
  }

  return reduce;
}

/**
 * 
 * @param pathTarget
 * @param logObj
 * @returns {any}
 */
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

/**
 *
 * @param logIt
 */
function getPathRoot(logIt = false) {
  let pathRoot = process.cwd();
  if (logIt) {
    console.log(`pathRoot\n${pathRoot}`);
  }
  return pathRoot
}

/**
 *
 * @param logIt
 * @returns {string}
 */
function getPathParent(logIt = false) {
  const path = require('path');
  const pathRoot = process.cwd();
  const nameRoot = path.basename(pathRoot);
  const pathParent = pathRoot.replace(nameRoot, '');
  if (logIt) {
    console.log(`pathParent\n${pathParent}`);
  }
  return pathParent;
}

function getPathElectron(logIt = false) {
  const path = require('path');
  const pathRoot = process.cwd();
  const nameRoot = path.basename(pathRoot);
  const pathParent = pathRoot.replace(nameRoot, '');
  const pathElectron = path.join(pathParent, `${nameRoot}-electron`);
  if (logIt) {
    console.log(`pathElectron\n${pathElectron}`);
  }
  return pathElectron;
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
    dirNameElectron
        = `${getPathElectron(true)}`) {
  execAsync(cmd.npm_build, () => {
    setupElectron_index_html(title);
    setupElectron_renderer_js();
    const fs = require('fs');
    const path = require('path');

    const src = path.join('dist');
    const dest = path.join(dirNameElectron, 'public');
    if (fs.existsSync(dest)) {
      console.log(`dest exists --> rm ... ${dest}`);
      fs.rmSync(dest, {recursive: true, force: true});
    }

    console.log(`copy ... ${src}`);
    fs.cpSync(src, dest, {recursive: true, force: true});
    console.log(`end ... ${dest}`);
  });
}

/**
 * require('child_process').execSync(cmd)
 * @param cmd
 */
function execSync(cmd) {
  console.log(`execSync() cmd=${cmd}`);
  require('child_process').execSync(cmd);
  console.log(`execSync() finished... cmd=${cmd}`);
}

/**
 * npm cache clean --force
 */
function npmCacheClean() {
  execSync(cmd.npm_cache_clean_force);
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
  execSync(cmd.npm_install);
}

function yarnInstall() {
  execSync(cmd.yarn_install);
}

function openDirElectronOutSquirrel() {
  const path = require('path');
  const path_x64 = path.join('out', 'make', 'squirrel.windows', 'x64');
  const cmd = `start "o" ${path_x64}`;
  execAsync(cmd);
}

/**
 * npm run make -->
 *
 * then open out/make/squirrel.windows/x64/ dir
 */
function npmRunMakeOpenOutSquirrel() {
  execAsync(cmd.npm_make, () => {
    openDirElectronOutSquirrel();
  });
}

const cmd = {
  yarn_install: `yarn install`,
  npm_install: `npm install`,

  // `npm run build`
  npm_build: `npm run build`,
  // `npm run make`
  npm_make: `npm run make`,
  npm_cache_clean_force: `npm cache clean --force`,
};

module.exports = {
  setupVueToElectron: setupVueToElectron,
  setupElectron_index_html: setupElectron_index_html,
  setupElectron_renderer_js: setupElectron_renderer_js,

  cmd: cmd,

  readEnvFile: readEnvFile,
  readPackageJson: readPackageJson,
  getPathParent: getPathParent,
  getPathRoot: getPathRoot,

  execSync: execSync,
  execAsync: execAsync,
  openDirElectronOutSquirrel: openDirElectronOutSquirrel,
  npmRunMakeOpenOutSquirrel: npmRunMakeOpenOutSquirrel,

  npmCacheClean: npmCacheClean,
  npmInstall: npmInstall,
  yarnInstall: yarnInstall,
};