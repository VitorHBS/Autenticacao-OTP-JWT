import { z } from "zod";

export const authSignIn = z.object({
    email: z.email("E-mail inválido")
})