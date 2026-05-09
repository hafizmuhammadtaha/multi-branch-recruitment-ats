# Multi-Branch Recruitment & Applicant Tracking System — Backend API

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Setup & Run Locally](#setup--run-locally)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [API Endpoints](#api-endpoints)
  - [Auth](#1-auth)
  - [Branches](#2-branches)
  - [Jobs](#3-jobs)
  - [Applications](#4-applications)
  - [Interviews](#5-interviews)
  - [Users / Profile](#6-users--profile)
- [Role Reference](#role-reference)
- [Application Status Flow](#application-status-flow)
- [File Upload Rules](#file-upload-rules)
- [Email Triggers](#email-triggers)
- [Error Handling](#error-handling)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Atlas) |
| ODM | Mongoose |
| Auth | JWT (jsonwebtoken) |
| File Storage | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| File Upload | Multer + multer-storage-cloudinary |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary SDK config
│   │   ├── db.js               # MongoDB Atlas connection
│   │   └── email.js            # Nodemailer transporter
│   ├── controllers/            # Route handler logic
│   ├── middleware/
│   │   ├── auth.middleware.js  # protect (JWT verify) + authorize (RBAC)
│   │   ├── error.middleware.js # Global error handler
│   │   └── upload.middleware.js# Multer + Cloudinary storage configs
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── services/
│   │   ├── cloudinary.service.js
│   │   └── email.service.js
│   ├── utils/
│   │   ├── jwt.js              # generateToken(id)
│   │   └── response.js         # sendResponse helper
│   ├── app.js                  # Express app setup + route mounting
│   └── server.js               # Entry point — connects DB and starts server
```

---

## Environment Variables

Create a `.env` file in the `backend/` root. **Never commit this file.**

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ats_db

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
```

> For Gmail, use an **App Password** (not your real password). Generate one at: Google Account → Security → 2-Step Verification → App Passwords.

---

## Setup & Run Locally

```bash
# From project root
cd backend
npm install
npm run dev     # uses nodemon
# or
npm start       # production
```

Server runs on `http://localhost:5000`

---

## Authentication

Protected routes require a JWT token in the request header:

```
Authorization: Bearer <token>
```

You get the token from the `/api/auth/register` or `/api/auth/login` response.

**JWT expires in: 30 days**

---

## Response Format

All responses follow this consistent shape:

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## API Endpoints

### Base URL
- **Local:** `http://localhost:5000`
- **Production:** Set `VITE_API_URL` in your frontend `.env` to the deployed Render URL

---

### 1. Auth

#### Register
```
POST /api/auth/register
```
**Auth:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | ✅ | |
| email | string | ✅ | Must be unique |
| password | string | ✅ | |
| role | string | ❌ | `candidate` / `hr` / `admin` — defaults to `candidate` |

**Response `201`:**
```json
{
  "success": true,
  "_id": "64f...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "candidate",
  "token": "eyJhbGci..."
}
```

---

#### Login
```
POST /api/auth/login
```
**Auth:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "_id": "64f...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "candidate",
  "token": "eyJhbGci..."
}
```

> Store the `token` and `role` in localStorage or your auth context. Include the token in all subsequent protected requests.

---

### 2. Branches

#### Get All Branches
```
GET /api/branches
```
**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "_id": "64a...", "name": "Islamabad", "createdAt": "...", "updatedAt": "..." },
    { "_id": "64b...", "name": "Lahore" },
    { "_id": "64c...", "name": "Karachi" },
    { "_id": "64d...", "name": "Remote" }
  ]
}
```

---

#### Create Branch
```
POST /api/branches
```
**Auth:** `admin` only

**Request Body:**
```json
{
  "name": "Islamabad"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": { "_id": "64a...", "name": "Islamabad" }
}
```

> Branch names are unique — duplicate names return a `400` error.

---

### 3. Jobs

#### Get All Jobs
```
GET /api/jobs
GET /api/jobs?branch=Lahore
GET /api/jobs?title=developer
GET /api/jobs?branch=Karachi&title=react
```
**Auth:** Public

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| branch | string | Filter by branch name (case-insensitive) |
| title | string | Search by job title (partial match, case-insensitive) |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64e...",
      "title": "React Developer",
      "description": "We are looking for...",
      "branch": { "_id": "64b...", "name": "Lahore" },
      "availableSeats": 3,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

#### Get Job By ID
```
GET /api/jobs/:id
```
**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64e...",
    "title": "React Developer",
    "description": "Full description here...",
    "branch": { "_id": "64b...", "name": "Lahore" },
    "availableSeats": 3
  }
}
```

---

#### Create Job
```
POST /api/jobs
```
**Auth:** `hr`, `admin`

**Request Body:**
```json
{
  "title": "React Developer",
  "description": "We are looking for a skilled React developer...",
  "branch": "64b...",
  "availableSeats": 5
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | ✅ | |
| description | string | ✅ | |
| branch | string | ✅ | Branch `_id` (ObjectId) from `GET /api/branches` |
| availableSeats | number | ✅ | |

**Response `201`:** Created job object.

---

#### Update Job
```
PUT /api/jobs/:id
```
**Auth:** `hr`, `admin`

**Request Body** (all fields optional):
```json
{
  "title": "Senior React Developer",
  "availableSeats": 2
}
```

**Response `200`:** Updated job object with branch populated.

---

#### Delete Job
```
DELETE /api/jobs/:id
```
**Auth:** `hr`, `admin`

**Response `200`:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### 4. Applications

#### Apply for a Job
```
POST /api/applications
```
**Auth:** `candidate` only

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| jobId | string | ✅ | Job `_id` |
| resume | file | ✅ | PDF only, max 5MB |
| coverLetter | file | ❌ | PDF or DOCX, max 5MB |

**How to send from frontend (Axios example):**
```javascript
const formData = new FormData();
formData.append('jobId', jobId);
formData.append('resume', resumeFile);       // File object
formData.append('coverLetter', coverLetterFile); // Optional File object

await axios.post('/api/applications', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`
  }
});
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "candidate": "64g...",
    "job": "64e...",
    "resumeUrl": "https://res.cloudinary.com/...",
    "coverLetterUrl": "https://res.cloudinary.com/...",
    "status": "Submitted",
    "createdAt": "..."
  }
}
```

> `availableSeats` on the job is automatically decremented by 1. If seats are 0, returns `400`.

---

#### Get My Applications (Candidate)
```
GET /api/applications/me
```
**Auth:** `candidate` only

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "job": {
        "_id": "64e...",
        "title": "React Developer",
        "description": "...",
        "branch": "64b...",
        "availableSeats": 2
      },
      "candidate": { "_id": "64g...", "name": "John Doe", "email": "john@example.com" },
      "resumeUrl": "https://res.cloudinary.com/...",
      "coverLetterUrl": "https://res.cloudinary.com/...",
      "status": "Shortlisted",
      "createdAt": "..."
    }
  ]
}
```

---

#### Get All Applications (HR/Admin)
```
GET /api/applications
GET /api/applications?status=Shortlisted
GET /api/applications?jobId=64e...
GET /api/applications?status=Submitted&jobId=64e...
```
**Auth:** `hr`, `admin`

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| status | string | Filter by status (exact match) |
| jobId | string | Filter by job `_id` |

**Response `200`:** Array of application objects with `job` (title, branch) and `candidate` (name, email) populated.

---

#### Get Application By ID
```
GET /api/applications/:id
```
**Auth:** `candidate` (own only), `hr`, `admin`

> Candidates attempting to view another candidate's application receive `403 Forbidden`.

**Response `200`:** Full application object with job and candidate populated.

---

#### Update Application Status
```
PUT /api/applications/:id/status
```
**Auth:** `hr`, `admin`

**Request Body:**
```json
{
  "status": "Shortlisted"
}
```

**Valid status values:**

| Status | Triggers Email? |
|---|---|
| `Submitted` | No |
| `Under Review` | No |
| `Shortlisted` | ✅ Yes |
| `Interview Scheduled` | ✅ Yes (set automatically when interview is created) |
| `Rejected` | ✅ Yes |
| `Selected` | ✅ Yes |

**Response `200`:** Updated application object.

---

#### Send Custom HR Message
```
POST /api/applications/:id/message
```
**Auth:** `hr`, `admin`

**Request Body:**
```json
{
  "subject": "Next Steps",
  "message": "We would like to invite you for a technical assessment..."
}
```

| Field | Type | Required |
|---|---|---|
| subject | string | ❌ Defaults to `"Message from HR"` |
| message | string | ✅ |

**Response `200`:**
```json
{
  "success": true,
  "message": "Custom message sent successfully"
}
```

---

### 5. Interviews

#### Schedule Interview
```
POST /api/interviews
```
**Auth:** `hr`, `admin`

**Request Body:**
```json
{
  "applicationId": "64f...",
  "date": "2025-08-15",
  "time": "10:00 AM",
  "message": "Please bring your portfolio and be ready for a 45-minute technical round."
}
```

| Field | Type | Required |
|---|---|---|
| applicationId | string | ✅ |
| date | string | ✅ |
| time | string | ✅ |
| message | string | ❌ |

**Side effects (automatic):**
- Application status is updated to `Interview Scheduled`
- Confirmation email is sent to the candidate with date, time, and message

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "65a...",
    "application": "64f...",
    "date": "2025-08-15T00:00:00.000Z",
    "time": "10:00 AM",
    "message": "Please bring your portfolio...",
    "createdAt": "..."
  }
}
```

---

#### Get Interviews
```
GET /api/interviews
```
**Auth:** `candidate`, `hr`, `admin`

**Role-based filtering (automatic):**
- `candidate` — receives only their own interviews
- `hr` / `admin` — receives all interviews

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a...",
      "application": {
        "_id": "64f...",
        "candidate": { "name": "John Doe", "email": "john@example.com" },
        "job": { "title": "React Developer", "branch": "64b..." }
      },
      "date": "2025-08-15T00:00:00.000Z",
      "time": "10:00 AM",
      "message": "Please bring your portfolio..."
    }
  ]
}
```

---

### 6. Users / Profile

#### Get Current User Profile
```
GET /api/users/me
```
**Auth:** `candidate`, `hr`, `admin`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64g...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate",
    "profilePicUrl": "https://res.cloudinary.com/...",
    "createdAt": "..."
  }
}
```

---

#### Update Current User Profile
```
PUT /api/users/me
```
**Auth:** `candidate`, `hr`, `admin`

**Content-Type:** `multipart/form-data`

**Form Fields (all optional):**

| Field | Type | Notes |
|---|---|---|
| name | string | New display name |
| email | string | Must be unique across all users |
| password | string | Will be hashed automatically |
| profilePic | file | JPG / PNG / WEBP only, max 2MB |

**How to send from frontend (Axios example):**
```javascript
const formData = new FormData();
if (name) formData.append('name', name);
if (email) formData.append('email', email);
if (password) formData.append('password', password);
if (profilePicFile) formData.append('profilePic', profilePicFile);

await axios.put('/api/users/me', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`
  }
});
```

> If only updating text fields (name/email/password) with no file, you can also send `application/json` — the endpoint handles both.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64g...",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "candidate",
    "profilePicUrl": "https://res.cloudinary.com/..."
  }
}
```

---

## Role Reference

| Role | What They Can Do |
|---|---|
| `candidate` | Register/login, view jobs, apply for jobs, view own applications, view own interviews, edit own profile |
| `hr` | All candidate views + manage jobs, view all applications, update application status, send messages, schedule interviews, view all interviews |
| `admin` | All HR permissions + manage branches, create HR accounts |

---

## Application Status Flow

```
Submitted → Under Review → Shortlisted → Interview Scheduled → Selected
                                      ↘ Rejected
```

| Transition | Who triggers it | Email sent? |
|---|---|---|
| → Under Review | HR/Admin manually | No |
| → Shortlisted | HR/Admin manually | ✅ Yes |
| → Rejected | HR/Admin manually | ✅ Yes |
| → Interview Scheduled | Auto when interview created | ✅ Yes |
| → Selected | HR/Admin manually | ✅ Yes |

---

## File Upload Rules

| File Type | Field Name | Accepted Formats | Max Size | Cloudinary Folder |
|---|---|---|---|---|
| Resume | `resume` | PDF only | 5MB | `ats_resumes` |
| Cover Letter | `coverLetter` | PDF, DOCX | 5MB | `ats_cover_letters` |
| Profile Picture | `profilePic` | JPG, PNG, WEBP | 2MB | `ats_profile_pics` |

- All files are stored on **Cloudinary** — the backend returns a `secure_url` which is saved in MongoDB
- Profile pictures are auto-cropped to 400×400px
- Never store files locally — always use the Cloudinary URL from the response

---

## Email Triggers

Emails are sent automatically via Gmail SMTP in these situations:

| Event | Recipient | Triggered by |
|---|---|---|
| Application status → Shortlisted | Candidate | `PUT /api/applications/:id/status` |
| Application status → Rejected | Candidate | `PUT /api/applications/:id/status` |
| Application status → Selected | Candidate | `PUT /api/applications/:id/status` |
| Interview scheduled | Candidate | `POST /api/interviews` |
| Custom HR message | Candidate | `POST /api/applications/:id/message` |

---

## Error Handling

All errors return:
```json
{
  "success": false,
  "message": "Human readable error message"
}
```

Common HTTP status codes:

| Code | Meaning |
|---|---|
| 400 | Bad request (validation error, duplicate data, no seats) |
| 401 | Not authenticated (missing or invalid token) |
| 403 | Forbidden (wrong role, or candidate accessing other's data) |
| 404 | Resource not found |
| 500 | Internal server error |

In development (`NODE_ENV=development`), error responses also include a `stack` field for debugging.
