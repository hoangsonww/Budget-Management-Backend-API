// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      { runtime: 'automatic' }, // lets you skip `import React` everywhere
    ],
  ],
};
