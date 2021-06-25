module.exports = {
  publicPath: './',
  pages: {
    index: {
      entry: 'examples/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  // 强制内联CSS
  css: { extract: false },
};
