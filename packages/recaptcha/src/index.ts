import { DateTime } from 'luxon'
import { headers } from 'next/headers'

interface CaptchaResponse {
    success: boolean
    score: number
    action: string
    challenge_ts: string
    hostname: string
}

function verifyCaptchaResponse(data: CaptchaResponse, action: string) {
    let host = headers().get('host') ?? 'localhost'
    if (host === 'localhost:3000') {
        host = 'localhost'
    }
    return (
        data.success &&
        data.score > 0.5 &&
        data.hostname === host &&
        data.action === action &&
        DateTime.fromISO(data.challenge_ts).diffNow().as('seconds') < 30
    )
}

export async function verifyCaptchaFromRequest<
    TData extends { captchaToken: string },
>(data: TData, action: string, captchaKey: string) {
    const reqHeaders = headers()
    const ip =
        reqHeaders.get('x-forwarded-for') ??
        reqHeaders.get('x-vercel-forwarded-for')

    const form = new FormData()
    form.append('secret', captchaKey)
    form.append('response', data.captchaToken)
    if (ip) {
        form.append('remoteip', ip)
    }
    const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
            method: 'POST',
            body: form,
        }
    )
    const captchaResponse = (await response.json()) as CaptchaResponse
    if (!verifyCaptchaResponse(captchaResponse, action)) {
        throw new Error('Invalid captcha')
    }
}
