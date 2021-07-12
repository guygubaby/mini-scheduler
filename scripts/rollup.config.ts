import type {
  RollupOptions,
  OutputOptions,
  Plugin,
  ModuleFormat,
} from 'rollup';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from '../package.json';

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * @license MIT
  */`;

const formats: ModuleFormat[] = ['umd', 'esm', 'cjs'];

const output: OutputOptions[] = formats.reduce((accumulator, format) => {
  const baseConfig: OutputOptions = {
    format,
    banner,
    name: pkg.name,
  };
  const outputs: OutputOptions[] = [
    {
      ...baseConfig,
      file: `dist/index.${format}.js`,
    },
    {
      ...baseConfig,
      file: `dist/index.${format}.min.js`,
      plugins: [terser()],
    },
  ];
  return [...accumulator, ...outputs];
}, []);

const nodePlugins: Plugin[] = [resolve(), commonjs()];

const input = 'src/index.ts';

const configs: RollupOptions[] = [
  {
    input,
    output,
    plugins: [
      ...nodePlugins,
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
        },
      }),
    ],
  },
  {
    input,
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];

export default configs;
