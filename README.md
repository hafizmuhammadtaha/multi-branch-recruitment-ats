# multi-branch-recruitment-ats
A full-stack MERN application for managing hiring across multiple branches, featuring JWT auth, Cloudinary integration, and automated email notifications.



# Backend API Documentation

This document describes the REST API endpoints for the ATS backend.

## Authentication

### Register
- Method: `POST`
- URL: `/api/auth/register`
- Auth: Public
- Body:
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `role` (string, optional; one of `candidate`, `hr`, `admin`)
- Response: created user object with JWT token

### Login
- Method: `POST`
- URL: `/api/auth/login`
- Auth: Public
- Body:
  - `email` (string, required)
  - `password` (string, required)
- Response: authenticated user object with JWT token

## Branch Management

### Get All Branches
- Method: `GET`
- URL: `/api/branches`
- Auth: Public
- Response: list of branches

### Create Branch
- Method: `POST`
- URL: `/api/branches`
- Auth: `admin`
- Body:
  - `name` (string, required)
- Response: created branch

## Job Management

### Create Job
- Method: `POST`
- URL: `/api/jobs`
- Auth: `hr`, `admin`
- Body:
  - `title` (string, required)
  - `description` (string, required)
  - `branch` (string, branch ObjectId, required)
  - `availableSeats` (number, required)
- Response: created job

### Get Jobs
- Method: `GET`
- URL: `/api/jobs`
- Auth: Public
- Query Parameters:
  - `branch` (string, optional) — branch name filter
  - `title` (string, optional) — job title search
- Response: job list populated with branch details

### Get Job By ID
- Method: `GET`
- URL: `/api/jobs/:id`
- Auth: Public
- Response: single job with branch details

### Update Job
- Method: `PUT`
- URL: `/api/jobs/:id`
- Auth: `hr`, `admin`
- Body:
  - `title` (string, optional)
  - `description` (string, optional)
  - `branch` (string, optional)
  - `availableSeats` (number, optional)
- Response: updated job

### Delete Job
- Method: `DELETE`
- URL: `/api/jobs/:id`
- Auth: `hr`, `admin`
- Response: success message

## Application Management

### Apply for a Job
- Method: `POST`
- URL: `/api/applications`
- Auth: `candidate`
- Content-Type: `multipart/form-data`
- Fields:
  - `jobId` (string, required)
  - `resume` (file, required, PDF only)
  - `coverLetter` (file, optional, PDF or DOCX)
- Response: created application record

### Get My Applications
- Method: `GET`
- URL: `/api/applications/me`
- Auth: `candidate`
- Response: list of applications for current candidate

### Get All Applications
- Method: `GET`
- URL: `/api/applications`
- Auth: `hr`, `admin`
- Query Parameters:
  - `status` (string, optional)
  - `jobId` (string, optional)
- Response: filtered application list

### Get Application By ID
- Method: `GET`
- URL: `/api/applications/:id`
- Auth: `candidate`, `hr`, `admin`
- Notes: candidates can only view their own applications
- Response: application details

### Update Application Status
- Method: `PUT`
- URL: `/api/applications/:id/status`
- Auth: `hr`, `admin`
- Body:
  - `status` (string, required; one of `Submitted`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Rejected`, `Selected`)
- Response: updated application record
- Behavior: sends email when status becomes `Shortlisted`, `Rejected`, or `Selected`

### Send Custom Applicant Message
- Method: `POST`
- URL: `/api/applications/:id/message`
- Auth: `hr`, `admin`
- Body:
  - `subject` (string, optional)
  - `message` (string, required)
- Response: success message
- Behavior: sends custom email to the candidate

## Interview Management

### Schedule Interview
- Method: `POST`
- URL: `/api/interviews`
- Auth: `hr`, `admin`
- Body:
  - `applicationId` (string, required)
  - `date` (string, required)
  - `time` (string, required)
  - `message` (string, optional)
- Response: created interview record
- Behavior: updates application status to `Interview Scheduled` and emails the candidate

### Get Interviews
- Method: `GET`
- URL: `/api/interviews`
- Auth: `candidate`, `hr`, `admin`
- Notes: candidates receive only their interviews; HR/Admin receive all interviews
- Response: interview list with associated application, candidate, and job details

## User/Profile Management

### Get Current User Profile
- Method: `GET`
- URL: `/api/users/me`
- Auth: `candidate`, `hr`, `admin`
- Response: current user profile

### Update Current User Profile
- Method: `PUT`
- URL: `/api/users/me`
- Auth: `candidate`, `hr`, `admin`
- Body:
  - `name` (string, optional)
  - `email` (string, optional)
  - `password` (string, optional)
- Response: updated profile data

## Notes
- Protected routes require `Authorization: Bearer <token>` header.
- Uploaded resume/cover letter assets are stored in Cloudinary and the returned URLs are saved in application records.
- Email notifications are sent via Gmail SMTP using `nodemailer`.
- Application statuses are enforced via the application schema enum.
