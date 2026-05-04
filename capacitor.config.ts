import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.adoptafriend.app",
  appName: "Adopt a Friend",
  webDir: "dist",
  android: {
    // Permite tráfico http:// (cleartext) hacia el backend local de desarrollo
    allowMixedContent: true,
  },
};

export default config;
