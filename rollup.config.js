const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const license = require('rollup-plugin-license');
const { terser  } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');
const pkg = require('./package.json');

const licence = {
  banner: `
        ${pkg.title || pkg.name} - v${pkg.version}
        ${pkg.description}
        ${pkg.homepage}
        Made by ${pkg.author}
        Under ${pkg.license} License
      `
};

module.exports = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'PerfectScrollbar',
      file: pkg.main,
      format: 'umd'
    },
    plugins: [
      babel({
        exclude: ['/**/node_modules/**']
      }),
      resolve(), // so Rollup can find dependencies
      commonjs(), // so Rollup can convert dependencies to an ES module
      terser(),
      license(licence),
      filesize()
    ]
  },
  // browser-friendly, non-minified UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'PerfectScrollbar',
      file: 'dist/perfect-scrollbar.js',
      format: 'umd'
    },
    plugins: [
      babel({
        exclude: ['/**/node_modules/**']
      }),
      resolve(), // so Rollup can find dependencies
      commonjs(), // so Rollup can convert dependencies to an ES module
      license(licence),
      filesize()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    external: pkg.dependencies ? Object.keys(pkg.dependencies): [],
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    plugins: [
      babel({
        exclude: ['/**/node_modules/**']
      }),
      license(licence),
      filesize()
    ]
  }
];
