# 🛡️ Buddy Aid — Safety Platform

Buddy Aid is a community-focused safety web app with a polished light UI inspired by the supplied Buddy Aid showcase: white rounded cards, a soft pink canvas, red/pink primary actions, warm orange actions, blue map accents, and shield-style Buddy Aid branding.

## Stack

- Frontend: React 18 + Vite 6 + Tailwind CSS + Lucide
- Backend: Node.js 20+ + Express + Socket.IO
- Database: MongoDB + Mongoose
- OTP email: Resend
- Media: Cloudflare R2 (S3-compatible)
- Maps: Google Maps JavaScript API (demo fallback map is included)
- Hosting: Vercel (frontend) + Render (backend)
- Source control: Git + GitHub

## Repository

```text
buddy-aid/
├── frontend/   # React application
├── backend/    # Express API + Socket.IO
├── docs/       # Architecture, API and design docs
└── .github/    # CI / issue / pull-request templates
```

## Requirements

Use Node.js 20 or 22. The project is pinned to compatible package versions; do not change Vite/plugin versions to `latest` unless you also verify peer compatibility.

## Installation

Install dependencies separately from the two application folders:

```bash
cd frontend
npm install
cd ../backend
npm install
```

Or from the repository root:

```bash
npm run install:all
```

## Local development

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`
Backend health: `http://localhost:5000/api/health`

The UI has a demo-friendly fallback, so you can explore the screens without configuring every external service.

## Environment variables

Copy these files before local development:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Never commit a real `.env` or API secret.

### Frontend

- `VITE_API_URL`
- `VITE_GOOGLE_MAPS_API_KEY`

### Backend

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_BASE_URL`

## Resend OTP flow

```text
Email → /api/auth/send-otp → generate OTP → hash + store in MongoDB → Resend → email
Email + OTP → /api/auth/verify-otp → verify → JWT → dashboard
```

Without a MongoDB/Resend configuration, the API uses a demo fallback and logs the OTP server-side for local exploration.

## Deployment

### Vercel

Create a Vercel project pointing at `frontend/`.

Build command:

```bash
npm run build
```

Set `VITE_API_URL` and the map key if used.

### Render

Create a web service pointing at `backend/`.

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Set the backend environment variables in Render.

### MongoDB Atlas

Create the database and set `MONGODB_URI`.

### Resend

Create an API key and verify the sending address/domain. Set `RESEND_API_KEY` and `RESEND_FROM`.

### Cloudflare R2

Create the bucket and S3-compatible credentials. Set the R2 variables.

## Validation

```bash
npm run build:frontend
npm run check:backend
```

## Safety note

Buddy Aid is a support tool and does not replace local emergency services. In immediate danger, use the appropriate local emergency service.
