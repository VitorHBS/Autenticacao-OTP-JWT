import { RequestHandler } from "express";
import { authSignIn } from "../schemas/auth-signin";
import { email, z } from "zod";
import { getUserByEmail } from "../services/user";
import { generateOtp } from "../services/otp";
import { sendEmail } from "../libs/mailtrap";

export const signin: RequestHandler = async (req, res) => {
    //Validar os dados recebidos
    const data = await authSignIn.safeParse(req.body);

    if (!data.success) return res.json({ error: z.treeifyError(data.error) });

    //Verificar se o usuário existe (baseado no e-mail)
    const user = await getUserByEmail(data.data.email);

    if (!user) return res.json({ error: "Usuário inexistente" })

    //Gerar um código OTP para esse 
    const otp = await generateOtp(user.id);

    //Enviar um Email para esse 
    await sendEmail(
        user.email,
        `Seu código de acesso é: ${otp.code}`,
        `Digite o código de acesso: ${otp.code}`
    )

    //Devolve o ID do código OTP
    res.json({ id: otp.id })
}