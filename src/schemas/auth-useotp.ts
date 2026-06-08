import { z } from "zod";

export const validateOTP = z.object({
    id: z.string({message: "ID do OTP obrigatório"}),
    code: z.string().length(6)
})