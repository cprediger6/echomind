// src/types/next-auth.d.ts
// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      createdAt?: Date;
    };
  }

  interface User {
    createdAt?: Date;
  }
}
