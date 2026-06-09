import { z } from "zod";

export const validateOtpSchema = z.object({
    id: z.string({message: "ID do OTP obrigatório"}),
    code: z.string({message: "Code é obrigatório"}).length(6, {message: "obrigatório 6 numeros"})
})