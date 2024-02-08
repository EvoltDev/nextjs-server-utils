import { z } from 'zod'
import SESTransport from 'nodemailer/lib/ses-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import nodemailer from 'nodemailer'

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

let config: SESTransport.Options | SMTPTransport.Options = {}

export function configure(emailConfig: EmailConfig) {
    switch (emailConfig.EMAIL_TRANSPORT) {
        case 'SMTP':
            config = {
                host: emailConfig.SMTP_HOST,
                port: emailConfig.SMTP_PORT,
                secure: emailConfig.SMTP_SECURE,
                auth: {
                    user: emailConfig.SMTP_USER,
                    pass: emailConfig.SMTP_PASS,
                },
            }
            break
        case 'SES':
            const SES = require('@aws-sdk/client-ses').SES
            const ses = new SES()
            config = {
                SES: ses,
            }
    }
}

export const transporter = nodemailer.createTransport(config)
