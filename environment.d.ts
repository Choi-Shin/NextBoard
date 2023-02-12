declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      MONGO_URI: string;
      PORT?: string;
      PWD: string;
    }
  }
}

export {};
