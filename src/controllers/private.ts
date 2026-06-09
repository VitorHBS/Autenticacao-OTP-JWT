import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getUserById } from "../services/user";


export const teste = async (req: ExtendedRequest, res: Response) => {

    if (!req.userId) return res.status(401).json({ error: "Acesso negado" })

    const user = await getUserById(req.userId);

    return res.json({user})
}