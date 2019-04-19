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
