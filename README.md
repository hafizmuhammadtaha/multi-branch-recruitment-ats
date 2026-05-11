# TechVista ATS — Multi-Branch Recruitment & Applicant Tracking System

A full-stack MERN application for managing hiring across multiple branches, featuring JWT auth, Cloudinary integration, role-based access control, and automated email notifications.

## 🌐 Live Deployment

| Service | URL |
|---|---|
| **Frontend (Vercel)** | `https://ats-frontend-ten.vercel.app/`
| **Backend (Render)** | `https://ats-backend-tdql.onrender.com/api` 

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Hook Form, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| File Storage | Cloudinary (via multer-storage-cloudinary) |
| Email | Nodemailer + Gmail SMTP |

---

## 📁 Project Structure

```
multi-branch-recruitment-ats/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, Email configs
│   │   ├── controllers/    # Route handler logic
│   │   ├── middleware/      # Auth, error handling, file uploads
│   │   ├── models/          # Mongoose schemas (User, Job, Branch, Application, Interview)
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Email, Cloudinary services
│   │   ├── utils/           # JWT helper, response helper
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point
│   ├── seed.js              # Database seeder (branches, users, sample jobs)
│   └── .env                 # Environment variables (not committed)
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext provider
│   │   └── pages/           # Route pages (public, candidate, hr, admin)
│   └── index.html
└── README.md
```

---


## 🔐 Roles & Permissions

| Role | Capabilities |
|---|---|
| `candidate` | Register, view jobs, apply, upload resume/cover letter, view own applications & interviews, edit profile |
| `hr` | All candidate access + create/edit/delete jobs, review applications, change status, schedule interviews, send messages |
| `admin` | All HR access + manage branches, full system overview |

---

## 📊 Application Status Flow

```
Submitted → Under Review → Shortlisted → Interview Scheduled → Selected
                                       ↘ Rejected
```

| Status Change | Email Triggered? |
|---|---|
| → Under Review | No |
| → Shortlisted | ✅ Yes |
| → Interview Scheduled | ✅ Yes (auto when interview created) |
| → Rejected | ✅ Yes |
| → Selected | ✅ Yes |

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Backend

```bash
cd backend
npm install
# Create .env file (see Environment Variables section)
npm run seed    # Seed database with branches, users, and sample jobs
npm run dev     # Start with nodemon
```

### Frontend

```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev     # Start Vite dev server
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ats_db
JWT_SECRET=your_jwt_secret_key_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ `.env` files are in `.gitignore` — never commit credentials.

---

## 🌱 Seed Data

Run `npm run seed` in the `/backend` directory to create:

| Type | Data |
|---|---|
| **Branches** | Islamabad, Lahore, Karachi, Remote |
| **Admin** | admin@techvista.com / 123456 |
| **HR** | hr@techvista.com / 123456 |
| **Candidate** | candidate@example.com / 123456 |
| **Sample Jobs** | 6 jobs across Engineering, Design, QA, DevOps, Marketing |

---

## 📡 API Documentation

See the full API documentation in [backend/src/README.md](./backend/src/README.md)

### Quick Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new user |
| `/api/auth/login` | POST | Public | Login and get JWT token |
| `/api/branches` | GET | Public | List all branches |
| `/api/branches` | POST | Admin | Create a branch |
| `/api/jobs` | GET | Public | List/filter jobs |
| `/api/jobs` | POST | HR/Admin | Create a job |
| `/api/jobs/:id` | PUT | HR/Admin | Update a job |
| `/api/jobs/:id` | DELETE | HR/Admin | Delete a job |
| `/api/applications` | POST | Candidate | Apply to a job (multipart) |
| `/api/applications/me` | GET | Candidate | My applications |
| `/api/applications` | GET | HR/Admin | All applications (filterable) |
| `/api/applications/:id/status` | PUT | HR/Admin | Update status (triggers email) |
| `/api/applications/:id/message` | POST | HR/Admin | Send custom message |
| `/api/interviews` | POST | HR/Admin | Schedule interview |
| `/api/interviews` | GET | All | List interviews (role-filtered) |
| `/api/users/me` | GET/PUT | All | View/update profile |
| `/api/health` | GET | Public | Health check |

---

## 📦 Deployment

### Backend → Render

1. Connect your GitHub repo to [render.com](https://render.com)
2. Create a **Web Service** pointing to the `backend/` directory
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Set all environment variables in the Render dashboard
6. Update `FRONTEND_URL` to your Vercel deployment URL

### Frontend → Vercel

1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Set framework to **Vite**
3. Set root directory to `frontend/`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy

### Database → MongoDB Atlas

1. Create free M0 cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Whitelist IP `0.0.0.0/0` in Network Access
3. Copy connection string to `MONGO_URI`

---

## 📄 License

This project was developed as a semester project for BSCS Web Development course.

© 2025 TechVista Solutions — All Rights Reserved.
