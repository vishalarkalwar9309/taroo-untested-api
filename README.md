# Task Manager API

A small REST API for keeping track of tasks. I built this as the take-home assignment for Taroo's Full Stack Developer Intern role, focusing on tests, a couple of bug fixes, and the task-assignment endpoint.

## What's included

- Create, list, update, and delete tasks
- Filter tasks by status and retrieve a paginated list
- Mark a task as complete and view task stats
- Assign a task to a person with `PATCH /tasks/:id/assign`
- Unit tests for the service and route-level tests with Supertest

## Run it locally

You'll need Node.js and npm installed.

```bash
npm install
npm start
```

The server listens on port `3000` by default. You can set the `PORT` environment variable to use another port. Tasks are kept in memory, so they reset when the process restarts; there is no database to configure for this exercise.

## Tests

```bash
npm test -- --runInBand
npm run coverage
```

The coverage command prints a summary in the terminal and writes the HTML report under `coverage/`.

## API at a glance

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/tasks` | List tasks; accepts `status`, `page`, and `limit` query parameters |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/complete` | Mark a task as done |
| PATCH | `/tasks/:id/assign` | Assign a non-empty name to a task |
| GET | `/tasks/stats` | Return counts by status and the overdue count |

For task creation, `title` is required. Supported statuses are `todo`, `in_progress`, and `done`; supported priorities are `low`, `medium`, and `high`.

## Notes

The findings from testing and the fixes made for this assignment are in [BUG_REPORT.md](./BUG_REPORT.md). This is an intentionally small exercise API; it doesn't include authentication, persistent storage, or production deployment hardening.
