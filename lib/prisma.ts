import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  return client;
}

const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

export default prisma;

// import { PrismaClient } from "@prisma/client";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { neonConfig } from "@neondatabase/serverless";
// import ws from "ws"; // Import synchronously

// // Configure WebSocket for Neon - MUST happen before any connection attempts
// neonConfig.webSocketConstructor = ws;

// // Prevent multiple instances in development
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// // Initialize Prisma Client with Neon adapter
// function createPrismaClient() {
//   const connectionString = process.env.DATABASE_URL;
//   if (!connectionString) {
//     throw new Error("DATABASE_URL environment variable is not set");
//   }

//   // Create adapter with proper configuration
//   const adapter = new PrismaNeon({ connectionString });

//   // Create new PrismaClient with the adapter
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return new PrismaClient({ adapter } as any);
// }

// // Use existing Prisma instance if available, otherwise create a new one
// const prisma = globalForPrisma.prisma || createPrismaClient();

// // Save reference to prisma client on the global object in development
// if (process.env.NODE_ENV === "development") {
//   globalForPrisma.prisma = prisma;
// }

// export default prisma;
