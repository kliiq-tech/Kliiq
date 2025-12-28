# Supabase Configuration Issues & Fixes

## Issue 1: Email Confirmation Redirect
**Problem**: Email confirmation links redirect to `localhost:3000` instead of your production URL.

**Fix**:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/lfaehtsnpyelsmrgnlad)
2. Navigate to **Authentication** → **URL Configuration**
3. Update **Site URL** to: `https://kliiq.vercel.app`
4. Add **Redirect URLs**:
   - `https://kliiq.vercel.app/**`
   - `http://localhost:5173/**` (for local dev)

## Issue 2: Email Confirmation Requirement
**Problem**: Users can't access the dashboard until they confirm their email.

**Quick Fix (Disable Email Confirmation)**:
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **OFF** "Confirm email"
3. Save

**OR** manually confirm users:
1. Go to **Authentication** → **Users**
2. Find the user
3. Click the three dots → **Confirm User**

## Issue 3: CORS Configuration
The backend needs to allow requests from your Vercel frontend domain.

**Already configured in code**, but verify these origins are allowed:
- `https://kliiq.vercel.app`
- `http://localhost:5173`
