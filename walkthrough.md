# StayVista Full-Stack Vacation Rental Platform Walkthrough

A complete, production-ready travel booking platform implementing all user, host, admin features, security protections, maps integration, and automated test coverages.

---

## Codebase Map

### 💻 Backend (`airbnb-backend/`)
```
├── pom.xml                        # Dependencies: Spring Web, Security, Data JPA, JJWT, Cloudinary, Mail
├── Dockerfile                     # Alpine-based JRE 21 deployment container
├── render.yaml                    # Deploy blueprint config pointing to database/secrets configs
└── src
    ├── main
    │   ├── java/com/stayvista
    │   │   ├── AirbnbBackendApplication.java
    │   │   ├── config/            # SecurityConfig, AppConfig (ModelMapper, Cloudinary)
    │   │   ├── controller/        # Auth, User, Property, Booking, Review, Wishlist, Notification, Admin, Category
    │   │   ├── dto/               # Safe transfer objects (Auth, Property, Booking, Review, User, Common)
    │   │   ├── entity/            # JPA schemas: User, Property, PropertyImage, Category, Booking, Review, Wishlist, Notification
    │   │   ├── exception/         # ResourceNotFound, BadRequest, Conflict, GlobalExceptionHandler
    │   │   ├── repository/        # JPA interfaces & PropertySpecification for search filters
    │   │   └── security/          # JwtTokenProvider, JwtFilter, Custom entry/access denied handlers
    │   └── resources/
    │       └── application.yml    # App credentials, JWT timing, CORS origins, and DB configs
    └── test/                      # Mockito unit suites for AuthService and BookingService
```

### 🎨 Frontend (`airbnb-frontend/`)
```
├── package.json                   # React 18, React Router v6, Tailwind, TanStack Query, Framer Motion, Leaflet
├── vite.config.js                 # Alias path resolver & local backend dev proxy
├── tailwind.config.js             # Styling palette, custom animation frames, google font extensions
├── vercel.json                    # Rewrite rules proxying routes back to backend production target
└── src
    ├── main.jsx                   # Entry linking DOM, Router, TanStack Query, Theme, and Auth Providers
    ├── index.css                  # Tailwinds layers & base component button/card classes
    ├── context/                   # AuthContext (token/role handlers), ThemeContext (dark toggle)
    ├── hooks/                     # useDebounce, useLocalStorage, useInfiniteScroll
    ├── services/                  # api.js (Axios instance with auto refresh), authService, propertyService, bookingService, services.js
    ├── components/
    │   ├── common/                # ErrorBoundary, Skeleton, StarRating, Modal, PageLoader
    │   ├── layout/                # MainLayout, Navbar (profile details & badges), Footer
    │   └── booking/               # BookingWidget (date conflict exclusions, billing calculations)
    └── pages/                     # Home, PropertyList, PropertyDetail, Booking, BookingHistory, Wishlist, Profile, Host, Admin, Auth, NotFound
```

---

## Core Security Implementations
- **Stateless Authentication**: Enforced via `JwtAuthenticationFilter` reading headers. Auto-refreshes tokens using Axios interceptors.
- **Role Verification**: Handled by `@PreAuthorize` backend decorators and custom `ProtectedRoute` route guards.
- **SQL Injection & XSS Guarding**: Handled natively by Spring Data Hibernate parameter bindings and strict client input validations.
- **Validation**: Enforced via `jakarta.validation` annotations on all input DTOs.

---

## Verification & Testing Blueprints
Run backend test suites:
```bash
cd airbnb-backend
mvn clean test
```

Run frontend tests:
```bash
cd airbnb-frontend
npm run test
```
