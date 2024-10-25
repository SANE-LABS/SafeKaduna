let environment = process.env.BASE_URL_environment;

let config =
  environment === "development"
    ? {
        API_URL: process.env.EXPO_PUBLIC_API_URL || "",
        SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || "",
      }
    : {
        API_URL: process.env.EXPO_PUBLIC_PROD_API_URL || "",
        SOCKET_URL: process.env.EXPO_PUBLIC_PROD_API_URL || "",
      };
export default config;
