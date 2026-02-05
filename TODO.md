# TODO: Fix Email Verification and Role-Based Access

## Issues
1. Email Verification Bypass: Frontend bypasses backend checks by auto-force verifying Firebase.
2. Role-Based Access Not Working: No protected routes on frontend.

## Plan
- [x] Create ProtectedRoute component to check user roles.
- [x] Update index.js to protect /admin and /admin-profile routes.
- [x] Modify Authentication.js to call backend /login endpoint after Firebase login to enforce backend checks.
- [x] Test the fixes.
