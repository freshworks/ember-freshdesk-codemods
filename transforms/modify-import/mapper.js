module.exports = [{
    importDeclaration: 'freshdesk/tests/helpers/util-test-helpers',
    importSpecifiers: [
      'addFeatures',
      'addLaunched',
      'addAbilities',
      'convertMirageToModel',
      'removeFeatures',
      'removeAbilities',
      'spyFlashMessage'
    ]
  },
  {
    importDeclaration: 'freshdesk/tests/helpers/integration-test-helpers',
    importSpecifiers: [
      'setupCurrentUser',
      'setupCurrentAccount'
    ]
  }
];
