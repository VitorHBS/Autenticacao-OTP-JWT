import { prisma } from "../libs/prisma";

export const getUserByEmail = async (email: string) => {
    const user = prisma.user.findUnique({
        where: { email }
    })
    return user
}