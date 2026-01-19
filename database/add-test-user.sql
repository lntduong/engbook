-- Script to add a test USER to the database
-- Run this in your Vercel Postgres SQL console

INSERT INTO users (email, password_hash, name, role)
VALUES (
  'user@engbook.com',
  '$2b$10$BHQgJELGzNKAlush3ovMT./f97HLdEWi9j7W.3UVLvN/c6140s3ZK',
  'Test User',
  'USER'
) ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, email, name, role, created_at FROM users WHERE email = 'user@engbook.com';
