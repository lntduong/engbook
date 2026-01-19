import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const isBuildTime = process.env.DATABASE_URL_DATA?.includes('dummy') || process.env.DATABASE_URL?.includes('dummy');

const prismaClientSingleton = () => {
    if (isBuildTime) {
        console.warn('⚠️  Using MOck Prisma Client for Build Time ⚠️');
        // Create a deep proxy that returns empty promises for everything
        return new Proxy({} as any, {
            get: (target, prop) => {
                if (prop === 'then') return undefined; // Not a promise itself

                // Return a function that behaves like an async method (findMany, create, etc)
                // returning an empty array or null
                return new Proxy(() => Promise.resolve([]), {
                    get: (funcTarget, funcProp) => {
                        if (funcProp === 'then') return undefined;
                        return () => Promise.resolve([]);
                    },
                    apply: () => Promise.resolve([])
                });
            }
        });
    }
    return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
