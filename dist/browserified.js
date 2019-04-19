(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var lr = ALLEX.execSuite.libRegistry;
lr.register('vektr_loaderlib',
  require('./index')(
    ALLEX,
    lr.get('vektr_storagelib')
  )
);

},{"./index":2}],2:[function(require,module,exports){
function createLib (execlib, storagelib) {
  'use strict';

  var lib = execlib.lib;
  var ret = {};

  require('./loadercreator')(lib, storagelib, ret);

  return ret;
}

module.exports = createLib;

},{"./loadercreator":3}],3:[function(require,module,exports){
function createLoader(lib, storagelib, mylib){
  'use strict';

  function loadProgressReporter (progresscb, percent) {
    if (progresscb) {
      progresscb({
        type: 'load',
        percent: percent
      });
    }
  }
  function svgLoaded(url,cb,progresscb,response){
    var xml = response.responseXML;
    if(!xml){
      cb();
      return;
    }
    if (!xml.documentElement && window.ActiveXObject && response.responseText) {
      xml = new ActiveXObject('Microsoft.XMLDOM');
      xml.async = 'false';
      //IE chokes on DOCTYPE
      if (progresscb) {
        progresscb({type:'load', progress: null});
      }
      xml.loadXML(response.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,''));
    }
    if (!xml.documentElement) {
      cb();
    } else {
      new storagelib.Svg(xml.documentElement,cb,progresscb ? loadProgressReporter.bind(null, progresscb) : null);
    }
    xml = null;
  }
  function downloadProgressReporter (progresscb, percent) {
    if (progresscb) {
      progresscb({
        type: 'download',
        percent: percent
      });
    }
  }
  function loadSVG(url,cb,progresscb,errorcb){
    if(!lib.isFunction(cb)){return;}
    url = url.replace(/^\n\s*/, '').trim();
    lib.request(url,{
      onProgress:progresscb ? downloadProgressReporter.bind(null, progresscb) : progresscb,
      onError:errorcb,
      onComplete:svgLoaded.bind(null,url,cb,progresscb)
    });
  }
  function loadSVGPromised(url) {
    var d = lib.q.defer(), ret = d.promise;
    loadSVG(url, d.resolve.bind(d), d.notify.bind(d), d.reject.bind(d));
    d = null;
    return ret;
  }
  mylib.loadSVG = loadSVG;
  mylib.loadSVGPromised = loadSVGPromised;
}

module.exports = createLoader;

},{}]},{},[1]);
