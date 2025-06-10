import NextAuth, { DefaultSession } from 'next-auth';

export interface CustomUser {
  id: string;
  role: string;
  username: string;
  email: string;
  name: string;
  image: string | null;
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

// Extensão do tipo JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    email: string;
    name: string;
    image?: string;
  }
}

export declare module "next-auth" {
  interface Session {
    user: CustomUser & DefaultSession['user'];
  }
  
  interface User extends CustomUser {}

  interface JWT {
    id: string;
    role?: string;
    email: string;
    name: string;
    image?: string;
  }
}