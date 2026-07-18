# System Architecture

```mermaid
flowchart LR
    User[Guest / Host / Admin] --> Frontend[React Frontend<br/>Vite + React Router + Tailwind]
    Frontend --> Backend[Spring Boot Backend<br/>REST API + JWT Auth]
    Backend --> DB[(PostgreSQL / H2 Database)]
    Backend --> Storage[Cloudinary<br/>Image Storage]
    Backend --> Mail[SMTP Email Service]
    Frontend --> Mock[Mock API<br/>Local Development]
    Backend --> Mock
```

## Component overview
- Frontend: renders the booking, property, auth, and dashboard experience.
- Backend: exposes APIs for authentication, listings, bookings, reviews, wishlist, and admin operations.
- Database: stores users, properties, bookings, and related domain data.
- Integrations: Cloudinary handles media uploads and SMTP handles transactional emails.
- Mock API: provides local fallback data and development support.
