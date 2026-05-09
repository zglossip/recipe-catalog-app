import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.zglossip.recipecatalog",
  appName: "Recipe Catalog",
  webDir: "dist",
  server: {
    //TODO: Before deploy, set up https and change the androidScheme to https
    androidScheme: "http",
  },
};

export default config;
