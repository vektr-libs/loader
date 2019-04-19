var lr = ALLEX.execSuite.libRegistry;
lr.register('vektr_loaderlib',
  require('./index')(
    ALLEX,
    lr.get('vektr_storagelib')
  )
);
