module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    hot: true,
  },
  // configureWebpack: {
  //   output: {
  //     libraryExport: 'default',
  //   },
  // },
  pages: {
    index: {
      entry: 'examples/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
};
