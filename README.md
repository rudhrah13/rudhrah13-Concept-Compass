# Concept Compass

Concept Compass is an MVP web app to evaluate student concept understanding using structured AI-led conversations and provide actionable insights to teachers.

## What’s in this repository

- Frontend built with Next.js (App Router) + TypeScript + Tailwind
- Mocked backend API flows (no real Firebase/AI yet)
- Student and Teacher flows implemented
- Concept-level and student-level evaluation UI

## What’s intentionally missing (MVP)

- Real Firebase Authentication
- Real Firestore persistence
- AI evaluation logic (currently mocked)
- Voice input / speech-to-text
- Parent or admin views

## High-level architecture

Frontend (Next.js)
  → Mock API layer (Cloud Functions stubs)
  → Future: Firebase Firestore + AI evaluation service

All frontend components already consume APIs as if backend were real.

## Key folders

src/app/        # Routes (student, teacher, dashboard, feedback)
src/components/ # Reusable UI components
src/lib/        # Auth, feature flags, mock data
src/types/      # Shared data contracts
src/hooks/      # UI/business logic hooks

## Run locally

1. Clone the repo
2. Install dependencies:
   npm install
3. Start dev server:
   npm run dev
4. Open http://localhost:3000

## Login (Mocked)

- Select Student or Teacher on login screen
- Role is stored in localStorage
- No real authentication yet

## AI integration (planned)

AI will be integrated into the `/evaluateConcept` backend flow.

Responsibilities:
- Generate structured evaluation JSON
- Classify understanding (Strong / Partial / Weak)
- Identify concept gaps and language issues
- No tutoring or free chat

Frontend already expects this JSON shape.

## Contribution notes

- Keep frontend contracts stable
- Do not change response schemas without discussion
- AI logic should plug into mocked backend flows

## Status

MVP – frontend complete, backend mocked.
Actively under development.

