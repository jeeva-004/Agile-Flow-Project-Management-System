# AgileFlow Project Management System - Deployment Guide

This guide details the steps required to configure, deploy, and verify the containerized frontend application, backend application, and database services for AgileFlow.

## Prerequisites

Before starting the deployment, make sure you have the following installed on your system:
- **Docker** (v20.10.0 or later)
- **Docker Compose** (v2.0.0 or later)

---

## Configuration

Environment variables are configured in the `.env` file located at the root directory of the project.

| Variable Name | Default Value | Description |
|---|---|---|
| `DB_HOST` | `mysql-db` | The database container name/hostname within the Docker bridge network. |
| `DB_NAME` | `agileflow_db` | The name of the MySQL database. |
| `DB_USER` | `root` | MySQL root database user. |
| `DB_PASSWORD` | `1234` | Password for the MySQL database. |
| `DB_HOST_PORT` | `3308` | Mapped database port on the host machine. |
| `BACKEND_PORT` | `8080` | Mapped Spring Boot port on the host machine. |
| `JWT_SECRET` | `7e3f1c4a...` | HMAC-SHA 256-bit secret key used for JWT signing. |
| `JWT_EXPIRATION` | `86400000` | JWT validity duration in milliseconds (default: 24 hours). |
| `UPLOAD_DIR` | `uploads` | Mapped directory for storing uploaded project attachments. |
| `FRONTEND_PORT` | `80` | Mapped Nginx web server port on the host machine. |

---

## Deploying with Docker Compose

You can build and deploy the application ecosystem using simple Docker Compose commands from the project root directory.

### 1. Build and Run in Detached Mode

To build the images (if not built already) and run the containers in the background, run:

```bash
docker compose up --build -d
```

### 2. View Container Logs

To follow the logs for all services or a specific service:

```bash
# Follow logs for all services
docker compose logs -f

# Follow logs for the frontend container only
docker compose logs -f frontend

# Follow logs for the backend container only
docker compose logs -f backend
```

### 3. Verify Service Status

To inspect container runtime states:

```bash
docker compose ps
```

The database container `mysql-db` should report `(healthy)` when initialization completes, and the `backend` and `frontend` should report `up` or `running`.

### 4. Stop Services

To stop and remove containers and network structures (while preserving database data):

```bash
docker compose down
```

To also remove volumes (which resets all database states):

```bash
docker compose down -v
```

---

## Verification & Health Check

1. **Database Health**:
   The MySQL container features an integrated health check using `mysqladmin ping`. Verify by ensuring `docker compose ps` marks the database container as healthy.
2. **Backend API Readiness**:
   Check if the Spring Boot backend is responding to incoming HTTP requests:
   ```bash
   curl -I http://localhost:8080/api/auth/login
   ```
   (Expect an HTTP 405 Method Not Allowed or 401 Unauthorized response depending on request payloads, validating that the servlet container is online and routing endpoints).
3. **Frontend Application Readiness**:
   Check if the Nginx server serving the frontend is responding to incoming HTTP requests:
   ```bash
   curl -I http://localhost:80
   ```
   (Expect an HTTP 200 OK response, indicating that Nginx is online and serving the compiled Angular SPA files).

---

## Troubleshooting

- **Database Connection Failures**:
  If the backend container shuts down immediately on startup, it might mean the database took longer than 50 seconds to boot up. Verify MySQL health via `docker compose logs mysql-db` and try running `docker compose up -d` again.
- **Port Conflict**:
  If port `80`, `3308`, or `8080` is already in use on your host machine, modify `FRONTEND_PORT`, `DB_HOST_PORT`, or `BACKEND_PORT` inside the local `.env` file before executing `docker compose up`.
