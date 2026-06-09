import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = async (id: number) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
    );
}

export const verifyJWT = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

        const token = authHeader.split(" ")[1];

        if (!token) return res.status(401).json({ error: "Formato de token inválido" });

        jwt.verify(
            token,
            process.env.JWT_SECRET as string,
            (err, decoded: any) => {
                if (err) {
                    console.error("[JWT] Erro ao validar token:", err.message);
                    return res.status(401).json({ error: "Token inválido ou expirado" })
                }

                req.userId = decoded.id;
                next()
            },
        )
    } catch (error) {
        console.error("[JWT] Erro:", error);
        return res.status(500).json({ error: "Erro ao processar token" })
    }
}