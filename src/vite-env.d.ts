/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_RECIPE_API_URL?: string;
  readonly VITE_RECIPE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __BUILD_COMMIT__: string;
declare const __BUILD_BRANCH__: string;
