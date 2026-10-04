# API overview

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/send-otp` | Send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP and receive JWT |
| GET | `/api/reports` | List reports |
| POST | `/api/reports` | Create report |
| POST | `/api/emergencies` | Start emergency |
| PATCH | `/api/emergencies/:id/location` | Update location |
| PATCH | `/api/emergencies/:id/end` | End emergency |
| GET | `/api/contacts` | List contacts |
| POST | `/api/contacts` | Add contact |
| DELETE | `/api/contacts/:id` | Delete contact |
| POST | `/api/support` | Create support ticket |
