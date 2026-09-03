# FinSense Vue - Setup & Authentication Guide

## Executive Summary

This document provides a consolidated technical guide for the FinSense Vue application, covering critical bug fixes, environment configuration, JWT authentication architecture, and production setup.

**System Status**: ✅ **PRODUCTION READY**

---

## Critical Fixes Applied

### 1. Vue Template Syntax Fix (CRITICAL)
- **Issue**: Vue components were incorrectly using React syntax (`className=`) instead of Vue syntax (`class=`).
- **Scope**: Fixed 51 files and 775+ occurrences across components, views, and layouts.
- **Impact**: CSS styling now renders properly across all UI views.

### 2. Environment Configuration
- **Frontend**: Created `.env.local` and `.env.development` with `VITE_API_URL=http://localhost:5000/api`.
- **Backend**: Updated `.env` with Supabase PostgreSQL connection (`DATABASE_URL`), `JWT_SECRET`, `FRONTEND_URL`, and server `PORT`.

### 3. API Service & Axios Interceptors
- Configured base URL fallback and 10-second request timeout.
- Added automatic token refresh handling on `401 Unauthorized` responses with retry prevention.
- Enhanced network error handling and debug logging.

### 4. Authentication Store (Pinia) & Router Guards
- Added error state tracking, loading management, and proper async/await handling in `src/stores/auth.js`.
- Implemented async auth initialization before route navigation in `src/router/index.js`.
- Configured guest-only route guards and redirect parameter support after login.

---

## Authentication Architecture & Workflows

### 1. Registration Flow
1. User submits form (`email`, `password` ≥ 6 chars, `full_name`).
2. Frontend validates input → `POST /api/auth/register`.
3. Backend validates schema (Joi), hashes password via `bcryptjs` (salt rounds: 10), and saves user to Supabase DB.
4. User is redirected to the login page.

### 2. Login Flow
1. User submits credentials → `POST /api/auth/login`.
2. Backend verifies hash and issues:
   - **Access Token**: JWT (1-hour expiry)
   - **Refresh Token**: UUID v4 (7-day expiry, stored in DB)
3. Frontend stores tokens in `localStorage` and updates Pinia auth store.
4. Router redirects user to `/dashboard`.

### 3. Automatic Token Refresh
1. Request returns `401 Unauthorized` due to expired access token.
2. Axios interceptor intercepts response and calls `POST /api/auth/refresh-token`.
3. New access token is returned and saved; the original request is automatically retried.

### 4. Logout Flow
1. User triggers logout → `POST /api/auth/logout`.
2. Backend marks refresh token as revoked in database.
3. Frontend clears `localStorage` and redirects to `/login`.

---

## API Endpoints Reference

| Endpoint | Method | Headers / Body | Description |
| :--- | :---: | :--- | :--- |
| `/api/auth/register` | `POST` | `{ email, password, full_name }` | Register new user account |
| `/api/auth/login` | `POST` | `{ email, password }` | Authenticate user & issue tokens |
| `/api/auth/profile` | `GET` / `PUT` | `Authorization: Bearer <Token>` | Get or update authenticated user profile |
| `/api/auth/refresh-token` | `POST` | `{ refreshToken }` | Obtain new access token |
| `/api/auth/logout` | `POST` | `{ refreshToken }` | Revoke token and terminate session |
| `/api/auth/forgot-password` | `POST` | `{ email }` | Request password reset link |
| `/api/auth/reset-password` | `POST` | `{ token, newPassword }` | Reset password using valid token |
| `/api/health` | `GET` | None | Verify backend server status |

---

## Environment Setup

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=FinSense
```

### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@supabase-host:5432/postgres
DIRECT_URL=postgresql://user:password@supabase-host:5432/postgres
JWT_SECRET=your_secure_jwt_secret_key
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

---

## Production Deployment Checklist

1. Set `NODE_ENV=production` and update `FRONTEND_URL` and `JWT_SECRET` in backend `.env`.
2. Build frontend static assets: `npm run build` (outputs to `dist/`).
3. Deploy backend using PM2 or Docker container with entry point `server.js`.
4. Enforce HTTPS across all frontend and API endpoints.

---
**Last Updated**: 2026-01-09  
**Status**: 🟢 **PRODUCTION READY**
