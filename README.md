# Global AI Assistance

A mobile-first, multilingual assistance platform for everyday problems, education, careers, skills, private sharing, and emergency guidance.

## Current production architecture

- Next.js frontend and server routes
- Auth.js + Google OAuth for the administrator
- Server-side OpenAI Responses API integration
- PostgreSQL schema for private submissions, daily advice, and verified emergency-service records
- Server-only environment variables for secrets

## Required before public launch

1. Deploy the app to a supported Next.js host.
2. Configure `ADMIN_EMAIL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.
3. Configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL`.
4. Create PostgreSQL and run `db/schema.sql`.
5. Set the deployed OAuth callback URL in Google Cloud.
6. Populate and verify emergency-service records for each supported country.
7. Add production rate limiting, abuse monitoring, backups, retention/deletion workflows, and security review.

The repository intentionally does not contain passwords, API keys, or other production secrets.

## Important safety behavior

The AI must not present medical information as a diagnosis. High Alert must not claim that authorities have been contacted unless a real, authorized integration exists. Emergency contacts shown to users should come from verified country-specific records.

## Health check

After deployment, `/api/health` reports whether AI and database environment variables are configured. It does not expose their values.
