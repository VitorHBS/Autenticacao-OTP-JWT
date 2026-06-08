import { prisma } from "../libs/prisma";

export const getUserByEmail = async (email: string) => {
    const user = prisma.user.findUnique({
        where: { email }
    })
    return user
}

export const createUser = async (email: string, name: string) => {
    const user = prisma.user.create({
        data: { name, email }
    });

    return user;
}