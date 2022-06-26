module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // sourceMaps: true,
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};