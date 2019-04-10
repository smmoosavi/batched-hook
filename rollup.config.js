import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { rollupName } from './package.json';

const env = process.env.NODE_ENV;

const envFormats = {
  cjs: 'cjs',
  es: 'esm',
  development: 'iife',
  production: 'iife',
};

const config = {
  input: 'src/index.ts',
  output: [
    {
      name: rollupName,
      format: envFormats[env],
    },
  ],
  plugins: [
    replace({
      ENVIRONMENT: JSON.stringify(env),
    }),
    resolve({
      extensions: ['.ts'],
    }),
    commonjs({
      include: ['node_modules/**'],
      namedExports: {},
    }),
    babel({
      extensions: ['.ts'],
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(terser());
}

export default config;
