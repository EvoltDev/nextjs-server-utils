import nodemailer, { SendMailOptions } from 'nodemailer'
import { EmailConfig } from './config'
import SESTransport from 'nodemailer/lib/ses-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export { emailConfigSchema } from './config'
export type { EmailConfig } from './config'

export class Mailer {
    private readonly config: SESTransport.Options | SMTPTransport.Options
    private transporter

    constructor(emailConfig: EmailConfig) {
        switch (emailConfig.EMAIL_TRANSPORT) {
            case 'SMTP':
                this.config = {
                    host: emailConfig.SMTP_HOST,
                    port: emailConfig.SMTP_PORT,
                    secure: emailConfig.SMTP_SECURE,
                    auth: {
                        user: emailConfig.SMTP_USER,
                        pass: emailConfig.SMTP_PASS,
                    },
                }
                break
            case 'SES': {
                const SES = require('@aws-sdk/client-ses').SES
                const ses = new SES()
                this.config = {
                    SES: ses,
                }
            }
        }
        this.transporter = nodemailer.createTransport(this.config)
    }

    sendEmail(data: SendMailOptions) {
        return this.transporter.sendMail(data)
    }
}
