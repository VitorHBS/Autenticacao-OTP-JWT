import { prisma } from "../libs/prisma";

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    return user
}

export const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })
    return user
}

export const createUser = async (email: string, name: string) => {
    const user = await prisma.user.create({
        data: { name, email }
    });

    return user;
}