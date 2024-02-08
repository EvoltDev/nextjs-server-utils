import { SendMailOptions } from 'nodemailer'
import { transporter } from './config'

export { emailConfigSchema, configure } from './config'
export type { EmailConfig } from './config'

export function sendEmail(data: SendMailOptions) {
    return transporter.sendMail(data)
}
