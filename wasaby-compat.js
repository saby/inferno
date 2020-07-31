const
    fs = require('fs-extra'),
    path = require('path'),
    infernoFilePath = '/packages/inferno/dist/index.cjs',
    hydrateFilePath = '/packages/inferno-hydrate/dist/index.cjs',
    infernoVarName = 'infernoSource',
    infernoIndexAmd = 'Inferno/third-party/index',
    infernoHydrateAmd = 'Inferno/third-party/hydrate';

function unixifyPath(filePath) {
  return filePath.replace(/\\/g, '/');
}
function replaceRequire(data) {
    return data.replace('require("inferno")', infernoVarName).replace('require(\'inferno\')', infernoVarName);
}
 function infernoDefineModuleCreate(what, data, releaseMode) {
   const result = [];
   result.push(`define('${what}', ['Core/helpers/String/unEscapeASCII','Env/Env', 'UI/Utils'], function (unEscapeASCII, Env, uiUtils) {var exports = {}, Logger = uiUtils.Logger; ${data} return exports;});`);
   if (releaseMode) {
     result.push(`define('${what}.min',['${what}'],function(infernoModule){return infernoModule;});`);
   }
   return result.join('\n');
 }
 function hydrateDefineModuleCreate(what, data, releaseMode) {
    const result = [];
    result.push(`define('${what}', ['Core/helpers/String/unEscapeASCII','Env/Env', 'Inferno/third-party/index', 'UI/Utils'], function (unEscapeASCII, Env, ${infernoVarName}, uiUtils) {var exports = {}, Logger = uiUtils.Logger; ${replaceRequire(data)} return exports;});`);
    if (releaseMode) {
      result.push(`define('${what}.min',['${what}'],function(infernoModule){return infernoModule;});`);
    }
    return result.join('\n');
}
    
 function copyData(pathToSave, sourcePath, amdName) {
  return function(savPath, srcPath, what) {
    const srcContent = fs.readFileSync(srcPath, 'utf8');
    let src = '';
    if (what.indexOf('hydrate') !== -1) {
      src = hydrateDefineModuleCreate(what, srcContent, sourcePath.endsWith('min.js'));
    } else {
      src = infernoDefineModuleCreate(what, srcContent, sourcePath.endsWith('min.js'));
    }
    //Do your processing, MD5, send a satellite to the moon, etc.
    fs.outputFileSync(savPath, src);
    console.log( savPath + ' complete');
  }(unixifyPath(pathToSave), unixifyPath(sourcePath), amdName);
}

copyData(
  path.join(__dirname, `${infernoIndexAmd}.js`),
  path.join(__dirname, `${infernoFilePath}.js`),
  infernoIndexAmd
);
copyData(
  path.join(__dirname, `${infernoIndexAmd}.min.js`),
  path.join(__dirname, `${infernoFilePath}.min.js`),
  infernoIndexAmd
);
copyData(
  path.join(__dirname, `${infernoHydrateAmd}.js`),
  path.join(__dirname, `${hydrateFilePath}.js`),
  infernoHydrateAmd
);
copyData(
  path.join(__dirname, `${infernoHydrateAmd}.min.js`),
  path.join(__dirname, `${hydrateFilePath}.min.js`),
  infernoHydrateAmd
);
