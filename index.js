function createLib (execlib, storagelib) {
  'use strict';

  var lib = execlib.lib;
  var ret = {};

  require('./loadercreator')(lib, storagelib, ret);

  return ret;
}

module.exports = createLib;
