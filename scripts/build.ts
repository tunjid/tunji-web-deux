import { build } from 'esbuild';
import clientConfig from '../clientConfig.json';
import serverConfig from '../serverConfig.json';

/**
 * Generic options passed during build.
 */
interface BuildOptions {
  env: string;
}

/**
 * A builder function for the app package.
 */
export async function buildClient(options: BuildOptions) {
  const { env } = options;

  await build({
    entryPoints: ['packages/client/src/index.tsx'],
    outfile: 'packages/client/public/script.js',
    define: {
      'process.env.NODE_ENV': `"${env}"`,
    },
    bundle: true,
    minify: env === 'production',
    sourcemap: env === 'development',
  });
}

/**
 * A builder function for the server package.
 */
export async function buildServer(options: BuildOptions) {
  const { env } = options;

  await build({
    entryPoints: ['packages/server/src/index.ts'],
    outfile: 'packages/server/dist/index.js',
    define: {
      'process.env.NODE_ENV': `"${env}"`,
    },
    external: ['express'],
    platform: 'node',
    target: 'node14.15.5',
    bundle: true,
    minify: env === 'production',
    sourcemap: env === 'development',
  });
}

/**
 * A builder function for all packages.
 */
async function buildAll() {
  await Promise.all([
    buildClient({
      env: clientConfig.env,
    }),
    buildServer({
      env: serverConfig.env,
    }),
  ]);
}

// This method is executed when we run the script from the terminal with ts-node
buildAll();
