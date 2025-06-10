import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

// Extensão do tipo Session
declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}

// Extensão do tipo JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export declare module "next-auth" {
  interface Session {
    user: CustomUser
  }

  interface JWT {
    id: string;
    role?: string;
    email: string;
    name: string;
    image?: string | null;
  }
}