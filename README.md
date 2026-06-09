# Vehicle Service Management System

## Project Overview
A fast, reliable web application built for vehicle service centers. It handles everything from registering customer vehicles to tracking spare parts, logging repair issues, and generating final invoices for payments.

## Features
- **Vehicle Management**: Register and track customer vehicles by VIN and license plate.
- **Component Inventory**: Manage a catalog of spare parts with purchase and repair prices.
- **Issue Tracking**: Log specific vehicle problems and assign parts for repair or replacement.
- **Payment & Invoicing**: Calculate final costs including labor, simulate invoices, and generate itemized receipts.
- **Dashboard Analytics**: View daily, monthly, and yearly revenue through interactive charts.

## Architecture
This uses a clean monorepo structure. The frontend and backend run entirely in isolated containers using Docker Compose, storing persistent data securely in PostgreSQL.

```text
 React (Vite)
      |
      |
 Django REST API
      |
 PostgreSQL
      |
 Docker Compose
```

## Tech Stack
- **Frontend**: React 19, Vite, Material UI (MUI), Recharts
- **Backend**: Python 3.12, Django 5, Django REST Framework
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker & Docker Compose

## Project Structure
```text
vehicle-service-management-system/
├── backend/
│   ├── apps/           # Django apps (vehicles, components, issues, etc.)
│   ├── config/         # Django settings and URL routing
│   ├── core/           # Base models, custom exceptions, service layer
│   ├── requirements/   # Python dependencies
│   └── manage.py
├── frontend/
│   ├── src/            # React components, pages, context, and API clients
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## Setup Instructions
If you want to run this locally without Docker, you'll need Node.js and Python installed.
1. **Backend**: Navigate to `backend/`, create a virtual environment, run `pip install -r requirements/base.txt`, `python manage.py migrate`, and `python manage.py runserver`.
2. **Frontend**: Navigate to `frontend/`, run `npm install`, and `npm run dev`.

However, the Docker Setup is highly recommended.

## Docker Setup
The easiest way to get everything running is with Docker Compose.

```bash
docker compose build --no-cache
docker compose up
```

Once it's running, you can seed the database with sample data:
```bash
docker compose exec backend python manage.py seed_data
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## Default Credentials
If you need to access the database directly or log into the Django Admin panel, use the following credentials.

**PostgreSQL Database:**
- **Database Name**: `vsm_db`
- **User**: `vsm_user`
- **Password**: `vsm_password`
- **Port**: `5432`

**Django Superadmin:**
*(Since no superadmin is seeded by default, you can easily create one using the command below)*
```bash
docker compose exec backend python manage.py createsuperuser --username admin --email admin@example.com
```
When prompted, set the password to whatever you like (e.g., `admin123`). You can then log into `http://localhost:8000/admin/` with these details.

## PostgreSQL Integration
We swapped out the default SQLite database for a production-ready PostgreSQL 16 instance.
- The database spins up automatically via Docker.
- Data is kept safe across container restarts using a persistent Docker volume (`vsm_pgdata`).
- A built-in health check ensures the Django backend waits until PostgreSQL is fully ready before running migrations and starting the server.

## Logging
The backend uses a structured, centralized logging system. Instead of noisy debug logs, we focus on capturing actual business events.

- **Request Tracking**: A custom middleware logs every API request, recording the HTTP method, endpoint, status code, and duration (e.g., `POST /api/v1/transactions/simulate_payment | Status=201 | Duration=42ms`).
- **Structured Format**: Logs follow a clean, readable format: `YYYY-MM-DD HH:MM:SS | LEVEL | module | Message | context`.
- **File Outputs**: Standard `INFO` logs go to `backend/logs/application.log`, while exceptions and unhandled errors are safely caught and dumped into `backend/logs/error.log`.

## API Endpoints
Here's a quick look at some of the core REST endpoints:
- `GET /api/v1/dashboard/summary/` - Fetches high-level stats.
- `GET /api/v1/vehicles/` - Lists all registered vehicles.
- `POST /api/v1/issues/` - Logs a new vehicle issue.
- `POST /api/v1/issues/{id}/assign_component/` - Assigns a part to an open issue.
- `POST /api/v1/transactions/simulate_payment/` - Calculates the final invoice.


## Future Improvements
If this were being prepped for a large-scale production release, I'd look into adding:
- **Redis & Celery**: For caching component catalogs and handling background asynchronous tasks.
- **Authentication**: JWT-based login for staff and mechanics.
- **SigNoz / OpenTelemetry**: To get deeper distributed tracing across the frontend and backend.
