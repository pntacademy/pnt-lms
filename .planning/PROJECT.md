# PNT Academy LMS

## What This Is
A highly scalable, "Google Classroom" style Learning Management System (LMS) portal for a robotics academy named "PNT Academy". It is designed to handle up to 10,000 concurrent students eventually, but engineered with a strict "Lean Startup" architecture to keep fixed costs at $20/month.

## Core Value
A scalable, cost-effective, and user-friendly portal for robotics students to access announcements, assignments, and curriculum, built with a premium, minimal workspace design.

## Target Audience
Students of PNT Academy enrolled in robotics courses.

## Success Metrics
- Fixed infrastructure costs remain <= $20/month.
- High scalability with minimal database read operations.
- Smooth UX with Google Classroom-style sidebar and card-based dashboard.

## Context
- Framework: Next.js (App Router) with TypeScript.
- Styling: Tailwind CSS and Shadcn UI (Default style, Slate/Zinc colors for a minimal, professional workspace feel).
- Database & Auth: Firebase (Auth for Email/Google login, Firestore for assignments/grades). Utilizing free tier heavily.
- Data fetching must be heavily optimized using Next.js caching and Incremental Static Regeneration (ISR).
- Storage: Cloudflare R2 for student assignment uploads (PDFs, code scripts, CAD files). We will use Presigned URLs to bypass Vercel server limits.
- Video: YouTube (Unlisted links) using customized iframes to hide branding and prevent related video distractions.
- Current Progress:
  - Next.js App Router project initialized.
  - Shadcn UI initialized, basic components installed.
  - Static visual layout for the login page created at `src/app/(auth)/login/page.tsx`.
- Immediate Task: Set up core layout and backend connection.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Modern React framework with excellent ISR and caching. | — Pending |
| Firebase (Auth/Firestore) | Fast to set up, generous free tier. | — Pending |
| Cloudflare R2 for Storage | Cheap egress, bypass Vercel limits with Presigned URLs. | — Pending |
| YouTube for Video | Free video hosting, can customize iframes. | — Pending |
| Shadcn UI | Minimal, professional workspace feel, highly customizable. | — Pending |

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Initialize Firebase config.
- [ ] Create `.env.local` template for Firebase and Cloudflare R2.
- [ ] Create layout and page structure for main student dashboard (`src/app/dashboard/page.tsx`).
- [ ] Implement sidebar navigation (Google Classroom style).
- [ ] Implement main content area for "Class Announcements".
- [ ] Implement main content area for "Pending Robotics Assignments".
- [ ] Use Shadcn UI cards for layout.

### Out of Scope
- Complex video hosting (using YouTube to save costs).
- Heavy Vercel server functions (bypassing limits with Presigned URLs to R2).

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-17 after initialization*
