# PROMPTS.md - Raw AI Chat Log

This file contains a record of the conversation with Claude (Anthropic) used throughout the development of this project, covering planning, backend development (TDD), Git/GitHub setup and troubleshooting, and frontend development.

---

## Session summary of topics covered, in order

1. Initial explanation of the TDD kata brief - what it asks for, why each requirement matters (TDD, AI transparency, clean commits), and a full task breakdown into backend, frontend, and documentation.
2. Step-by-step environment setup: installing Node.js, Git, VS Code, creating a GitHub account and repository.
3. Backend project initialization: npm init, installing Express, cors, bcryptjs, jsonwebtoken, sqlite/sqlite3.
4. Extensive Git/GitHub troubleshooting, including:
   - Accidentally running git init at the root of the entire Windows user profile instead of the project folder, and recovering from it.
   - PowerShell's echo command producing a .gitignore file with an encoding Git could not read correctly, causing node_modules to keep getting tracked despite the file existing - resolved by creating .gitignore through VS Code/heredoc instead.
   - Repeated git rm -r --cached node_modules cleanup cycles until node_modules was fully untracked.
   - GitHub authentication: generating and revoking a Personal Access Token, then switching to Git Credential Manager browser-based OAuth login.
   - A failed push due to HTTP 408 timeout caused by node_modules bloat, and a later rejected push resolved with git pull then git push.
5. TDD workflow for the backend, repeated per feature - write a failing test, confirm it fails for the right reason (Red), commit, implement the minimum code to pass (Green), commit, and push:
   - POST /api/auth/register
   - POST /api/auth/login (JWT issuance)
   - Auth middleware (401 for missing/invalid token)
   - GET /api/vehicles
   - POST /api/vehicles
   - GET /api/vehicles/search
   - PUT /api/vehicles/:id
   - DELETE /api/vehicles/:id (admin-only, via an adminOnly middleware checking req.user.role)
   - POST /api/vehicles/:id/purchase
   - POST /api/vehicles/:id/restock (admin-only)
6. Diagnosing and fixing a recurring test failure caused by a persistent SQLite file retaining data (duplicate email UNIQUE constraint violations) across test runs - resolved by switching to an in-memory SQLite database (:memory:) when NODE_ENV=test, using the cross-env package for cross-platform environment variable support on Windows.
7. Final backend test suite: 8 test suites, 11 tests, all passing.
8. Frontend setup: Vite + React scaffold, Tailwind CSS installation and configuration.
9. Deciding to keep frontend and backend in a single Git repository rather than as separate repos, to simplify submission.
10. Building the frontend:
    - api.js - Axios instance with a JWT bearer token interceptor reading from localStorage.
    - App.jsx - React Router setup with protected /dashboard route.
    - Login.jsx and Register.jsx pages, calling the backend auth endpoints.
    - Dashboard.jsx - vehicle listing, search, add-vehicle form, inline edit-vehicle form, purchase button (disabled at zero stock), and admin-only restock/delete buttons (admin status derived by decoding the JWT payload client-side).
11. UI/UX polish iterations:
    - An animated SVG car-and-road scene added to the Login page.
    - A custom Google Font (Outfit) applied globally.
    - Color-coded category badges, a SOLD OUT badge for zero-stock vehicles, and a POPULAR badge for the lowest-stock item.
    - A loading spinner while vehicles are being fetched.
    - A confetti-burst celebration popup shown after a successful purchase.
    - A custom SVG car icon replacing an emoji that had rendered incorrectly due to a PowerShell terminal encoding issue.
12. Instructions for manually promoting a registered user to the admin role directly in the SQLite database, for testing admin-only UI and endpoints.
13. Drafting README.md: project overview, tech stack, setup instructions, the full API endpoint table, the test report, the My AI Usage section, and a pointer to this file.
14. Further Git/file-system troubleshooting while saving README.md and this file - tracing a save-location mismatch between two different folders both named Backend on the same machine, resolved by locating the actual saved file and copying it into the correct Git-tracked folder.

---

## Notes on this log

This summary reflects the actual sequence and substance of the conversation used to build this project. It has been condensed for length and clarity rather than reproduced as a raw line-by-line transcript, since the source conversation was held in a browser chat interface without a built-in one-click export feature at the time of writing.
