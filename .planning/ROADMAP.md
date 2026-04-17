# Roadmap

**2 phases** | **6 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Setup & Config | Initialize Firebase and env variables | SETUP-01, SETUP-02 | 2 |
| 2 | Dashboard UI | Build the student dashboard layout and components | DASH-01, DASH-02, DASH-03, DASH-04 | 3 |

### Phase Details

**Phase 1: Setup & Config**
Goal: Set up Firebase client configuration and environment variables template.
Requirements: SETUP-01, SETUP-02
Success criteria:
1. `firebase.ts` is created and exports a valid Firebase app instance (even with placeholder env vars).
2. `.env.local` template is created with placeholders for Firebase and Cloudflare R2.

**Phase 2: Dashboard UI**
Goal: Build the main student dashboard layout and page using Shadcn UI.
Requirements: DASH-01, DASH-02, DASH-03, DASH-04
**UI hint**: yes
Success criteria:
1. `src/app/dashboard/layout.tsx` renders a sidebar navigation.
2. `src/app/dashboard/page.tsx` renders "Class Announcements" and "Pending Robotics Assignments" sections.
3. Both layout and page utilize Shadcn UI cards.
