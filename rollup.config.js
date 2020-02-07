import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';

export default [
  {
    input: './src/index.js',
    output: {
      file: './dist/webbit-store.js',
      format: 'umd',
      name: 'WebbitStore',
      globals: {
        'redux': 'Redux'
      }
    },
    plugins: [
      babel()
    ]
  },
  {
    input: './src/index.js',
    output: {
      file: './dist/webbit-store.min.js',
      format: 'umd',
      name: 'WebbitStore',
      globals: {
        'redux': 'Redux'
      }
    },
    plugins: [
      babel(),
      uglify()
    ]
  }
]