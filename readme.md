
## how to use ?

```javascript
const title = `electron index.html title`;
const dirNameElectron = 'xxxx-electron-path';
setupVueToElectron(title, dirNameElectron);
```

## works

#### setupVueToElectron()
```javascript
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
    dirNameElectron = `xxx-electron`) {}
```

#### setupElectron_index_html()
```javascript
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
    pathTarget = 'dist') {}
```

#### setupElectron_renderer_js()
```javascript
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
function setupElectron_renderer_js(pathTarget = 'dist') {}
```

---

#### readEnvFile()
```javascript
/**
 * read env file , eg: env.sh xxx.env
 * 
 * @param filename path env file
 * @param logObj default: false
 * @returns {{}}
 */
function readEnvFile(filename, logObj = false) {}
```

---

#### npmRunMakeOpenOutSquirrel()
```javascript
/**
 * npm run make -->
 * 
 * then open out/make/squirrel.windows/x64/ dir
 */
function npmRunMakeOpenOutSquirrel(){}
```

---

## how to install ?
```shell
npm install @vacantthinker/util_electron_vue_js -D
```


