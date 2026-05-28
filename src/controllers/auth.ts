import { RequestHandler } from "express";
import { authSignIn } from "../schemas/auth-signin";
import { z } from "zod";
import { getUserByEmail } from "../services/user";

export const signin: RequestHandler = async (req, res) => {
    //Validar os dados recebidos
    const data = await authSignIn.safeParse(req.body);

    if (!data.success) return res.json({ error: z.treeifyError(data.error) });

    //Verificar se o usuário existe (baseado no e-mail)
    const user = await getUserByEmail(data.data.email);

    if (!user) return res.json({ error: "Usuário inexistente" })

    //Gerar um código OTP para esse 
    
    //Enviar um Email para esse 
    
    //Devolve o ID do código OTP
    
}