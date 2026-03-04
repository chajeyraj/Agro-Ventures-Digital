import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import reactNativeWeb from 'vite-plugin-react-native-web';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react({
        babel: {
          plugins: ['react-native-reanimated/plugin'],
        },
      }), 
      tailwindcss(),
      reactNativeWeb(),
      {
        name: 'strip-worklets',
        transform(code, id) {
          if (id.includes('react-native-reanimated')) {
            return {
              code: code.replace(/"worklet";/g, '').replace(/'worklet';/g, ''),
              map: null,
            };
          }
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.NODE_ENV': JSON.stringify(mode),
      '__DEV__': mode === 'development',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react-native': 'react-native-web',
      },
    },
    optimizeDeps: {
      include: ['react-native-reanimated'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
