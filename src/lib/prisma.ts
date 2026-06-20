import { PrismaClient } from "@prisma/client";

// Transient Neon error codes / messages that are safe to retry
const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);
const RETRYABLE_MESSAGES = [
  "Server has closed the connection",
  "Can't reach database server",
  "Connection refused",
  "Connection reset by peer",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
];

function isRetryable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  if (e.code && RETRYABLE_CODES.has(e.code)) return true;
  if (e.message && RETRYABLE_MESSAGES.some((m) => e.message!.includes(m))) return true;
  return false;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isRetryable(err) || i === attempts - 1) throw err;
      // Exponential backoff: 500ms, 1500ms
      const delay = 500 * Math.pow(3, i);
      console.warn(`[prisma] Transient DB error, retrying in ${delay}ms (attempt ${i + 1}/${attempts})...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError;
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return client.$extends({
    query: {
      $allOperations({ args, query }) {
        return withRetry(() => query(args));
      },
    },
  });
}

type PrismaWithRetry = ReturnType<typeof createPrismaClient>;
const globalForPrisma = globalThis as unknown as { prisma: PrismaWithRetry };

export const prisma: PrismaWithRetry =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

