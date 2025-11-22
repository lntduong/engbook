-- Script to UPDATE existing users with correct password hashes
-- Run this in your Vercel Postgres SQL console

-- Update admin user password hash (password: admin123)
UPDATE users 
SET password_hash = '$2b$10$BJajvulhms4SUgv3jO.BK.R2C0uK8zTCY35VvfrgLetN8XCRn4hai'
WHERE email = 'admin@engbook.com';

-- Update or insert test user with correct hash (password: user123)
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'user@engbook.com',
  '$2b$10$BHQgJELGzNKAlush3ovMT./f97HLdEWi9j7W.3UVLvN/c6140s3ZK',
  'Test User',
  'USER'
) 
ON CONFLICT (email) 
DO UPDATE SET password_hash = '$2b$10$BHQgJELGzNKAlush3ovMT./f97HLdEWi9j7W.3UVLvN/c6140s3ZK';

-- Verify both users exist with correct data
SELECT id, email, name, role, 
       LEFT(password_hash, 20) as hash_preview,
       created_at 
FROM users 
WHERE email IN ('admin@engbook.com', 'user@engbook.com')
ORDER BY email;
