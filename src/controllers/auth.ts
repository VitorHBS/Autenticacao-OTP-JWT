import { RequestHandler } from "express";
import { authSignIn } from "../schemas/auth-signin";
import { email, json, z } from "zod";
import { createUser, getUserByEmail } from "../services/user";
import { generateOtp, validateOTP } from "../services/otp";
import { sendEmail } from "../libs/mailtrap";
import { signupSchema } from "../schemas/auth-signup";
import { createJWT } from "../libs/jwt";
import { validateOtpSchema } from "../schemas/auth-useotp";

export const signin: RequestHandler = async (req, res) => {
    try {
        //Validar os dados recebidos
        const data = await authSignIn.safeParse(req.body);

        if (!data.success) return res.status(400).json({ error: z.treeifyError(data.error) });

        //Verificar se o usuário existe (baseado no e-mail)
        const user = await getUserByEmail(data.data.email);

        if (!user) return res.status(404).json({ error: "Usuário inexistente" })

        //Gerar um código OTP para esse usuário
        const otp = await generateOtp(user.id);

        //Enviar um Email para esse usuário
        await sendEmail(
            user.email,
            `Seu código de acesso é: ${otp.code}`,
            `Digite o código de acesso: ${otp.code}`
        )

        console.log(`[AUTH] OTP gerado para usuário ${user.email}`);

        //Devolve o ID do código OTP
        res.json({ id: otp.id })
    } catch (error) {
        console.error("[AUTH] Erro no signin:", error);
        res.status(500).json({ error: "Erro ao processar sign-in. Tente novamente." })
    }
}

export const signup: RequestHandler = async (req, res) => {
    try {
        const data = signupSchema.safeParse(req.body);

        if (!data.success) return res.status(400).json({ error: z.treeifyError(data.error) });

        const user = await getUserByEmail(data.data.email);

        if (user) return res.status(409).json({ error: "Email já cadastrado" });

        const newUser = await createUser(data.data.email, data.data.name);

        console.log(`[AUTH] Novo usuário criado: ${newUser.email}`);

        return res.status(201).json({ user: newUser })
    } catch (error) {
        console.error("[AUTH] Erro no signup:", error);
        res.status(500).json({ error: "Erro ao processar cadastro. Tente novamente." })
    }
}


export const useOTP: RequestHandler = async (req, res) => {
    try {
        const data = await validateOtpSchema.safeParse(req.body);

        if (!data.success) return res.status(400).json({ error: z.treeifyError(data.error) });

        const user = await validateOTP(data.data.id, data.data.code);

        if (!user) return res.status(401).json({ error: "Código inválido ou expirado!" });

        const token = await createJWT(user.id);

        console.log(`[AUTH] Usuário ${user.email} autenticado com sucesso`);

        return res.json({ token, user })
    } catch (error) {
        console.error("[AUTH] Erro ao validar OTP:", error);
        res.status(500).json({ error: "Erro ao validar código. Tente novamente." })
    }
}