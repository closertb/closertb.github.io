const csshook = require('css-modules-require-hook');
const lessParser = require('postcss-less').parse;
require('@babel/register');

csshook({
  generateScopedName: '[local]_[hash:base64:5]',
  extensions: ['.less', '.css'],
  processorOpts: { parser: lessParser },
  camelCase: true,
});

require('./server');
