import { resend } from '../config/resend.js';

export async function sendOtpEmail({ to, otp }) {
  if (!resend) {
    console.log(`[DEMO] OTP for ${to}: ${otp}`);
    return { demo: true };
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buddy Aid Verification</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#fff3f5;
  font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0"
style="background:#fff3f5;padding:35px 15px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="
max-width:600px;
width:100%;
background:#ffffff;
border-radius:24px;
overflow:hidden;
">

<!-- HEADER -->
<tr>
<td align="center"
style="
padding:35px 25px;
background:linear-gradient(135deg,#ef233c,#ec4899,#ff7a18);
">

<div style="
font-size:28px;
font-weight:800;
color:#ffffff;
">
🛡️ Buddy Aid
</div>

<div style="
margin-top:8px;
font-size:12px;
color:#ffffff;
letter-spacing:1.5px;
">
YOUR SAFETY • YOUR COMMUNITY
</div>

</td>
</tr>


<!-- MAIN CONTENT -->
<tr>
<td align="center"
style="padding:42px 35px;">

<div style="
width:70px;
height:70px;
line-height:70px;
border-radius:50%;
background:#fff0f5;
font-size:32px;
margin:0 auto 20px;
">
✉️
</div>


<h1 style="
margin:0;
font-size:30px;
color:#172554;
">
Verify Your Email
</h1>


<p style="
color:#64748b;
font-size:16px;
line-height:1.6;
margin:15px 0 30px;
">
Use this one-time code to continue signing in to
<strong style="color:#e11d48;">Buddy Aid</strong>.
</p>


<!-- OTP CARD -->
<table cellpadding="0" cellspacing="0">
<tr>

<td style="
padding:4px;
border-radius:18px;
background:linear-gradient(135deg,#ef233c,#ec4899,#ff7a18);
">

<table cellpadding="0" cellspacing="0">
<tr>

<td align="center"
style="
background:#fff8fa;
border-radius:15px;
padding:20px 35px;
">

<div style="
font-size:11px;
font-weight:bold;
letter-spacing:2px;
color:#be123c;
margin-bottom:10px;
">
VERIFICATION CODE
</div>

<div style="
font-size:38px;
font-weight:800;
letter-spacing:9px;
color:#172554;
">
${otp}
</div>

</td>
</tr>
</table>

</td>
</tr>
</table>


<!-- EXPIRY -->
<div style="
display:inline-block;
margin-top:25px;
padding:10px 18px;
border-radius:30px;
background:#fff4e8;
color:#c2410c;
font-size:13px;
font-weight:bold;
">
⏱️ This code expires in 5 minutes
</div>


<p style="
margin-top:25px;
font-size:13px;
line-height:1.6;
color:#94a3b8;
">
If you didn't request this code, you can safely ignore this email.
</p>

</td>
</tr>


<!-- SECURITY FEATURES -->
<tr>
<td style="
background:#fffafa;
border-top:1px solid #f1f5f9;
padding:25px;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>

<td align="center">
<div style="font-size:22px;">🛡️</div>
<div style="
font-size:12px;
font-weight:bold;
color:#334155;
margin-top:6px;
">
Secure
</div>
</td>


<td align="center">
<div style="font-size:22px;">🔒</div>
<div style="
font-size:12px;
font-weight:bold;
color:#334155;
margin-top:6px;
">
Private
</div>
</td>


<td align="center">
<div style="font-size:22px;">⚡</div>
<div style="
font-size:12px;
font-weight:bold;
color:#334155;
margin-top:6px;
">
Fast
</div>
</td>

</tr>
</table>

</td>
</tr>


<!-- FOOTER -->
<tr>
<td align="center"
style="
background:#172554;
padding:25px;
">

<div style="
color:#ffffff;
font-size:16px;
font-weight:800;
">
Buddy Aid
</div>

<div style="
color:#cbd5e1;
font-size:12px;
margin-top:7px;
">
Your safety. Your community.
</div>

<div style="
color:#94a3b8;
font-size:11px;
margin-top:14px;
">
© 2026 Buddy Aid. All rights reserved.
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  return resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject: 'Your Buddy Aid verification code',
    html: emailHtml
  });
}