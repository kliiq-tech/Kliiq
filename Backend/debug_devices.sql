-- Debug Script for Kliiq Devices Issue
-- Run these queries one by one in Supabase SQL Editor

-- 1. Check if the device was inserted
SELECT * FROM public.devices;

-- 2. Check all users and their IDs
SELECT id, email, created_at FROM auth.users;

-- 3. Check if RLS is enabled on devices table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'devices';

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'devices';

-- 5. Test if you can see devices as the authenticated user
-- (This simulates what the app does)
SET request.jwt.claim.sub = 'd55fb4c3-1312-40e8-b4b5-f939546784a5';
SELECT * FROM public.devices WHERE user_id = 'd55fb4c3-1312-40e8-b4b5-f939546784a5';
