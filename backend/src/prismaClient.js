import { PrismaClient } from '@prisma/client'
// @prisma/client -> Client Prisma fournit par prisma lors de son installation

const prisma = new PrismaClient()
// On instancie le client prisma une seule fois pour pouvoir l'utiliser partout
export default prisma
