import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getUrl = () => {
    const url = process.env.DATABASE_URL_DATA;
    if (!url) return undefined;
    if (url.includes('pgbouncer=true')) return url;
    return `${url}${url.includes('?') ? '&' : '?'}pgbouncer=true`;
};

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: getUrl(),
        },
    },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
