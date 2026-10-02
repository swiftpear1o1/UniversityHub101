# IB Study & IA Tracker

A personal IB command center for a 30-day study plan, IA and coursework checklists, school planner milestones, weekly reviews, and daily study logs. The tracker opens at `/` and redirects to the IB dashboard at `/ib`. The existing UniversityHub admissions tools remain available at `/admissions` and their other routes.

## Requirements

- Node.js 20 or newer
- npm

## Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server refreshes the app as files change.

## Development checks

```bash
npm run typecheck
npm run build
```

Use `npm run start` to serve the production build locally after `npm run build`.

## Production deployment

The app is a standard Next.js project and can be deployed to Vercel or another Node.js host. Connect the repository, use `npm install` as the install command, `npm run build` as the build command, and `npm run start` to serve the production output where a persistent Node.js process is required. No server environment variables are needed for the tracker.

## Local data and backups

Tracker state is saved in this browser's `localStorage` under `ib-command-center-v1`. This includes daily tasks and custom tasks, checklist progress, planner date edits, weekly milestones, study hours, focus ratings, notes, theme, and tracker start date. Data is local to the current browser profile and does not sync between devices.

- Open **Settings → Export data as JSON** to download a backup.
- Use **Settings → Import JSON** to restore a tracker backup in this browser.
- Use **Settings → Reset tracker data** to clear saved tracker data and restore the starter plan. The app asks for confirmation before resetting.

The tracker uses the dates and month windows included in the supplied 2026–27 planner notes. Where the planner specified only a month, the calendar keeps the event at month level until an exact date is entered.
