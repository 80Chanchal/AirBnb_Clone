# AGENTS.md

## Project overview
This repository contains a full-stack vacation rental platform with three main parts:
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Spring Boot 3 + Java 21 + PostgreSQL
- Mock API: lightweight local API for development and testing

## Repository structure
- airbnb-frontend/: user-facing React application
- airbnb-backend/: REST API, business logic, security, persistence
- airbnb-mock-api/: local mock service for demo or fallback data
- render.yaml: deployment configuration for the backend service

## Working conventions
- Keep changes small, focused, and consistent with the existing architecture.
- Preserve current module boundaries between frontend, backend, and mock services.
- Prefer existing components, hooks, services, and patterns over introducing new abstractions.
- Keep authentication, validation, and authorization behavior intact.
- Use environment variables for secrets and external integrations.
- If API contracts change, update both frontend and backend together.

## Common commands
### Frontend
- cd airbnb-frontend
- npm install
- npm run dev
- npm run build
- npm run test

### Backend
- cd airbnb-backend
- ./mvnw test
- ./mvnw spring-boot:run

## Agent guidance
- For frontend work, inspect the pages, components, context, and services before editing.
- For backend work, inspect controllers, services, repositories, entities, and security classes.
- For booking, auth, property, and admin workflows, keep business rules and validation behavior consistent.
- Avoid hardcoding secrets; use configuration files or environment variables.
- When updating dependencies, keep versions compatible with the current stack.

## Notes
- The application uses JWT-based authentication and role-based access control.
- Media uploads are integrated with Cloudinary.
- Email delivery is configured through SMTP.
- The project is designed for deployment in a cloud hosting environment with a frontend and backend split.
