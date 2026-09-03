# FinSense Vue - Quick Reference & Cheat Sheet

## Quick Start Commands

### Backend Setup & Execution
```bash
cd vue/backend
npm install
npx prisma migrate dev   # Apply migrations if needed
npm run dev              # Server runs on http://localhost:5000
```

### Frontend Setup & Execution
```bash
cd vue/frontend
npm install
npm run dev              # Frontend runs on http://localhost:5173
```

---

## Test Credentials & Testing Workflow

### Standard Test User
- **Email**: `test@example.com`
- **Password**: `Test123456`
- **Full Name**: `Test User`

### Testing Steps
1. **Register**: Navigate to `http://localhost:5173/register` and submit details.
2. **Login**: Authenticate at `http://localhost:5173/login`. Check `localStorage` for `accessToken` and `refreshToken`.
3. **Protected Routes**: Try accessing `/stocks` or `/transactions` directly while logged out to verify route protection.
4. **Token Refresh**: Let access token expire; verify auto-refresh via Network tab.
5. **Logout**: Click profile menu → Logout. Confirm tokens are cleared from `localStorage`.

---

## Troubleshooting Guide

| Issue / Error | Cause | Solution |
| :--- | :--- | :--- |
| **API Connection Failed** | Backend server is down or wrong port | Ensure backend is running (`npm run dev`). Test via `curl http://localhost:5000/api/health`. |
| **CORS Error in Console** | Origin mismatch | Verify `FRONTEND_URL=http://localhost:5173` is set in `vue/backend/.env`. |
| **Login 404 / Route Error** | Incorrect API Base URL | Check `vue/frontend/.env.local` for `VITE_API_URL=http://localhost:5000/api`. |
| **Unstyled / Broken UI** | Leftover `className` syntax or cached CSS | Ensure components use `class=`. Hard refresh browser (`Ctrl+Shift+R`). |
| **401 Unauthorized / Token Error** | Expired or corrupted JWT secret | Clear browser storage: `localStorage.clear()` in Console, then log in again. |

---

## Database Schema Overview (Prisma / Supabase)

- **`Users`**: `id` (UUID), `email` (unique), `password_hash`, `full_name`, `created_at`.
- **`RefreshTokens`**: `id`, `token` (unique), `user_id` (FK), `expiresAt`, `revoked`.
- **`Transactions`**: `id`, `user_id` (FK), `amount`, `type`, `category_id`.
- **`Products` & `StockLogs`**: Inventory tracking linked to `user_id`.
- **`Debts` & `UmkmProfile`**: Financial logs and business metadata linked to `user_id`.

---

## cURL Testing Commands

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register   -H "Content-Type: application/json"   -d '{"email":"test@example.com","password":"Test123456","full_name":"Test User"}'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"test@example.com","password":"Test123456"}'
```

### 3. Fetch Protected Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile   -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---
**Status**: 🟢 **PRODUCTION READY**
