// Type definitions for Vite environment
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    API_KEY?: string;
  }
}
