const path = require('path');
const { resolve } = require('path');

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        examples: resolve(__dirname, 'examples/index.html')
      }
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'webbit-store'
    }
  }
}