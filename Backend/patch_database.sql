-- Fix for "invalid input syntax for type uuid" error in Packs
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Alter the column type from UUID[] to TEXT[] (since winget IDs are strings)
ALTER TABLE packs 
  ALTER COLUMN app_ids TYPE text[] 
  USING app_ids::text[];

-- 2. Verify settings (Optional)
-- This ensures that the column now accepts text arrays like ["Microsoft.VisualStudioCode", "Spotify.Spotify"]
