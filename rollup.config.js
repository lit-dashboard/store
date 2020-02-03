import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  output: {
    file: './dist/webbit-store.js',
    format: 'umd',
    name: 'WebbitStore',
    globals: {
      'redux': 'Redux',
      'lodash': '_'
    }
  },
  plugins: [
    babel()
  ]
}