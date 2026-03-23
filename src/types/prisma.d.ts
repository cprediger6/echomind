// src/types/prisma.d.ts
import { PrismaClient as PrismaClientType } from "@prisma/client/extension";

declare module "@prisma/client" {
  export class PrismaClient extends PrismaClientType {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(event: string, callback: (event: any) => void): void;
    $use(
      callback: (
        params: any,
        next: (params: any) => Promise<any>,
      ) => Promise<any>,
    ): void;
    $transaction<P extends Promise<any>[]>(
      arg: [...P],
    ): Promise<{ [K in keyof P]: Awaited<P[K]> }>;
    $queryRaw<T = unknown>(query: string, ...values: any[]): Promise<T>;
    $executeRaw<T = unknown>(query: string, ...values: any[]): Promise<T>;
  }
}
