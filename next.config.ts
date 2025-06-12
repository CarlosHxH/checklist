import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    AUTH_SECRET: "KnTdIVqfwV2XlZJ0vLI5CHlW5iCfobiuk7hcHEyIhYE=",
    JWT_SECRET: "KnTdIVqfwV2XlZJ0vLI5CHlW5iCfobiuk7hcHEyIhYE=",
    DATABASE_URL: "mysql://checklist:5s2024@localhost:3306/checklist"
  },
  /* config options here */
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://wks-ti004.5stransportes.com.br",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
export default nextConfig;