import { prisma } from "@/lib/prisma";

// utils/token.ts
export async function validateUserToken(token: string): Promise<boolean> {
    try {
      const account = await prisma.account.findFirst({
        where: {
          access_token: token,
          provider: 'credentials',
          expires_at: {
            gt: Math.floor(Date.now() / 1000),
          },
        },
      });
  
      return !!account;
    } catch {
      return false;
    }
  }