const eslintCommon = require('./eslint-common')

const config = {
  ...eslintCommon.commonConfig,
  extends: [...eslintCommon.commonExtends, 'next/core-web-vitals'],
  rules: {
    ...eslintCommon.commonRules,
    'import/no-unused-modules': [
      'error',
      {
        unusedExports: true,
        ignoreExports: ['**/pages/**/*.tsx']
      }
    ]
  }
}

module.exports = config
