import { RequestHandler } from "express";
import { authSignIn } from "../schemas/auth-signin";
import { email, z } from "zod";
import { createUser, getUserByEmail } from "../services/user";
import { generateOtp, validateOTP } from "../services/otp";
import { sendEmail } from "../libs/mailtrap";
import { signupSchema } from "../schemas/auth-signup";
import {  validateOtpSchema } from "../schemas/auth-useotp";

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

export const signup: RequestHandler = async (req, res) => {

    const data = signupSchema.safeParse(req.body);

    if (!data.success) return res.json({ error: z.treeifyError(data.error) });

    const user = await getUserByEmail(data.data.email);

    if (user) return res.json({ error: "Email já cadastrado" });

    const newUser = await createUser(data.data.email, data.data.name);

    return res.status(201).json({ user: newUser })
}


export const useOTP: RequestHandler = async (req, res) => {

    const data = await validateOtpSchema.safeParse(req.body);

    if (!data.success) return res.json({ error: z.treeifyError(data.error) });

    const user = await validateOTP(data.data.id, data.data.code);

    if(!user) return res.json({error: "Código inválido ou expirado!"});
    
}