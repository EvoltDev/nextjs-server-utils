import { z } from 'zod'

export const emailConfigSchema = z
    .object({
        SEND_EMAIL_TO: z.string().email(),
        SEND_EMAIL_FROM: z.string().email(),
    })
    .and(
        z.discriminatedUnion('EMAIL_TRANSPORT', [
            z.object({
                EMAIL_TRANSPORT: z.literal('SMTP'),
                SMTP_HOST: z.string(),
                SMTP_PORT: z.number({ coerce: true }),
                SMTP_SECURE: z
                    .string()
                    .transform((value) => value === 'true')
                    .pipe(z.boolean()),
                SMTP_USER: z.string(),
                SMTP_PASS: z.string(),
            }),
            z.object({
                EMAIL_TRANSPORT: z.literal('SES'),
                AWS_ACCESS_KEY_ID: z.string(),
                AWS_SECRET_ACCESS_KEY: z.string(),
                AWS_REGION: z.string(),
            }),
        ])
    )

export type EmailConfig = z.infer<typeof emailConfigSchema>
