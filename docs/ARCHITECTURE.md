# Buddy Aid Architecture

```text
React/Vite (Vercel)
   ↓ HTTPS / Socket.IO
Node/Express (Render)
   ├── MongoDB Atlas
   ├── Resend (OTP email)
   ├── Cloudflare R2 (media)
   └── Socket.IO (real-time events)
```

The emergency flow is: user → SOS → emergency session → location/contact notifications → optional recording → session end.
