module.exports = [{
    importDeclaration: 'freshdesk/tests/helpers/util-test-helpers',
    importSpecifiers: [
      'addFeatures',
      'addLaunched',
      'addAbilities',
      'convertMirageToModel',
      'removeFeatures',
      'removeAbilities',
      'spyFlashMessage',
      'setupSinonSandbox',
      'setSinonContext',
      'getSinonContext',
      'modifyFeatures'
    ]
  },
  {
    importDeclaration: 'freshdesk/tests/helpers/integration-test-helpers',
    importSpecifiers: [
      'setupCurrentUser',
      'setupCurrentAccount',
      'setupTranslations',
      'setupRenderingWithMirage',
      'setupAcceptance',
      'spyFlashMessage',
      'stubRouter'
    ]
  },
  {
    importDeclaration: 'freshdesk/tests/helpers/setup-acceptance',
    importType: 'default',
    importSpecifiers: [
      'setupAcceptance'
    ]
  }
];
