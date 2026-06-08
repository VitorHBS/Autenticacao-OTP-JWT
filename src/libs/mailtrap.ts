import { MailtrapClient } from "mailtrap";

export const sendEmail = async (to: string, subject: string, body: string) => {
    const mailtrap = new MailtrapClient({
        token: process.env.MAILTRAP_TOKEN as string,
        testInboxId: 4560819
    })

    try {

        await mailtrap.send({
                from: { name: "Mailtrap Test", email: "sender@example.com" },
                to: [{ email: to }],
                subject,
                text: body
            })

    } catch (err) {
        return false
    }
}