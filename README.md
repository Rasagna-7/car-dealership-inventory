Car Dealership Inventory System

A full-stack car dealership inventory system built as a TDD kata project. Users can browse, search, and purchase vehicles; admins can add, update, delete, and restock inventory — all backed by a JWT-secured REST API and a React dashboard.

Project overview
Authentication — register and log in, secured with JWT tokens
Vehicle inventory — add, view, search/filter, update, and delete vehicles
Stock management — purchase (decreases stock) and restock (admin-only, increases stock)
Role-based UI — regular users can browse and purchase; admins additionally see restock/delete controls
Tech stack

Backend

Node.js + Express
SQLite (file-based for development, in-memory for tests)
JWT (jsonwebtoken) + bcryptjs for password hashing
Jest + Supertest for testing

Frontend

React + Vite
Tailwind CSS
React Router
Axios
Setup instructions
Prerequisites
Node.js (LTS version)
Git
Backend setup
git clone https://github.com/Rasagna-7/car-dealership-inventory.git
cd car-dealership-inventory/Backend
npm install
npm start

The API runs at http://localhost:3000.

Run tests:

npm test
Frontend setup

In a separate terminal:

cd car-dealership-inventory/Backend/frontend
npm install
npm run dev

The app runs at http://localhost:5173. Make sure the backend is running first, since the frontend depends on it.

Testing admin features

New accounts are created with the regular user role by default. To test admin-only controls (restock, delete), manually promote your account after registering, then log out and log back in so the new role takes effect in your token.

API endpoints
Method	Endpoint	Description	Auth required
POST	/api/auth/register	Register a new user	No
POST	/api/auth/login	Log in and receive a JWT	No
GET	/api/vehicles	List all vehicles	Yes
GET	/api/vehicles/search	Search vehicles by make, model, category, price range	Yes
POST	/api/vehicles	Add a new vehicle	Yes
PUT	/api/vehicles/:id	Update a vehicle's details	Yes
DELETE	/api/vehicles/:id	Delete a vehicle	Yes (admin only)
POST	/api/vehicles/:id/purchase	Purchase a vehicle (decreases quantity)	Yes
POST	/api/vehicles/:id/restock	Restock a vehicle (increases quantity)	Yes (admin only)
Test report
Test Suites: 8 passed, 8 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        2.493s

All backend endpoints were built test-first following Red-Green-Refactor: a failing test was written and committed before any implementation code, then the minimum code needed to pass was added.

Screenshots

(Add screenshots of the login page, dashboard, add-vehicle form, and admin view here before submitting.)

*My AI Usage*


AI tool used: Claude (Anthropic)

How I used it:

I used Claude as a step-by-step guide and pair programmer across the entire project, since this was my first time building a full Node.js/Express/SQLite backend and a React/Tailwind frontend with a proper Git workflow on Windows.

Planning: Broke the project brief into ordered, manageable tasks (backend first, then frontend, then docs).
Environment troubleshooting: Worked through a series of real Windows-specific issues — PowerShell's echo command corrupting .gitignore's encoding, an accidentally-initialized Git repository at my entire user folder root, a node_modules folder that kept getting tracked by Git despite .gitignore, GitHub authentication (personal access tokens, then OAuth via Git Credential Manager), and a failed push caused by leftover node_modules history bloating the repo.
TDD workflow: For every backend endpoint, wrote a failing test first (Red), committed it, implemented the minimum code to pass (Green), committed again — repeated for registration, login, auth middleware, and all vehicle CRUD/purchase/restock endpoints.
Bug fixing: Diagnosed and fixed a recurring test-isolation bug where a persistent SQLite file caused duplicate-email failures across test runs, by switching to an in-memory database during test execution.
Frontend build: Generated the React component structure, the Login/Register/Dashboard pages, and iterated on UI polish — including an animated car/road scene on login, category color-coded badges, "Sold Out"/"Popular" badges, and a confetti celebration on purchase.
Documentation: Drafted this README and the AI usage reflection itself.

Reflection:

Using AI this way meant I wasn't handed a finished project — I hit real, unglamorous problems (broken terminal encodings, a corrupted Git history, files that silently failed to save mid-edit) and had to understand and resolve each one before moving forward. This sped up the parts I already understood conceptually while giving me space to genuinely learn the parts I didn't, particularly Git internals and Windows terminal quirks.

Raw AI chat logs

See PROMPTS.md in the project root for the full, unedited conversation log with Claude.


