# SmartStudy AI – Gemini Powered Learning Platform

SmartStudy AI is a hackathon-ready AI education platform that helps students learn faster and smarter using Google Gemini and Supabase.

## Features

-   **AI Chat Interface**: Chat with an AI tutor about your uploaded PDFs.
-   **Quiz Generator**: Automatically generate MCQs from study materials with instant feedback and scoring.
-   **Assignment Solver**: Get step-by-step solutions for complex assignment questions.
-   **Topic to Video**: Generate educational scripts and visual frame prompts for any topic.
-   **Gamified Learning**: Earn points for participating and getting questions right.
-   **Dark UI**: Premium glassmorphism design with a dark brown aesthetic.

## Tech Stack

-   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React.
-   **Backend**: Next.js API Routes, Supabase (Auth, DB, Storage).
-   **AI**: Google Gemini Pro (via Fetch API).

## Getting Started

### 1. Environment Variables
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://vjepnlfarrwxlpduhxxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GEMINI_API_KEY=AIzaSyB77oZokqIj8ghzdaZCzvTneNJT17UbQt4
```

### 2. Supabase Setup
Run the `supabase_setup.sql` script in the Supabase SQL Editor to create the necessary tables and functions.

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```

## Folder Structure
-   `/app`: Next.js App Router pages and API routes.
-   `/components`: Reusable UI and Dashboard components.
-   `/lib`: Core configuration for Supabase and Gemini.
-   `/hooks`: Custom React hooks (e.g., `useUser`).
-   `/public`: Static assets including the logo.

## Live Preview
To see a live preview, run `npm run dev` and open `http://localhost:3000`.
Sign up/Login to access the dashboard.
