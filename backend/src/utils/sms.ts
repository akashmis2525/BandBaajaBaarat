import { AppError } from './errors';
import { env } from '../config/env';

export async function deliverOtpSms(phone: string, code: string) {
  if (env.exposeOtp) return;

  if (!env.smsProvider || !env.smsApiKey) {
    throw new AppError(
      'SMS provider is not configured. Set SMS_PROVIDER and SMS_API_KEY for staging/production OTP delivery.',
      503,
    );
  }

  const provider = env.smsProvider.toLowerCase();
  const mobile = phone.replace(/\D/g, '').slice(-10);

  if (provider === 'msg91') {
    const url = env.smsApiUrl || 'https://control.msg91.com/api/v5/otp';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: env.smsApiKey,
      },
      body: JSON.stringify({
        template_id: env.smsTemplateId,
        sender: env.smsSender,
        mobiles: `91${mobile}`,
        otp: code,
      }),
    });
    if (!res.ok) throw new AppError('Unable to send OTP SMS', 502);
    return;
  }

  if (provider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    if (!accountSid) throw new AppError('TWILIO_ACCOUNT_SID is required for Twilio SMS', 503);
    const url =
      env.smsApiUrl || `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: `+91${mobile}`,
      From: env.smsSender,
      Body: `Your Band Baaja Baarat OTP is ${code}. It expires in 5 minutes.`,
    });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${env.smsApiKey}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!res.ok) throw new AppError('Unable to send OTP SMS', 502);
    return;
  }

  throw new AppError(`Unsupported SMS_PROVIDER "${env.smsProvider}". Use msg91 or twilio.`, 503);
}
