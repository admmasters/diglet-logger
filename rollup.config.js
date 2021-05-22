import typescript from '@wessberg/rollup-plugin-ts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      // exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      // exports: 'named',
    },
  ],
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  plugins: [typescript(), nodeResolve({ browser: true })],
};
