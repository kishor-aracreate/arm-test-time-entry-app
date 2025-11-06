# Timer App Backend

A Node.js/Express backend for the Timer App with PostgreSQL database and JWT authentication.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials and JWT secret.

3. Create PostgreSQL database:
```sql
CREATE DATABASE timer_app;
```

4. Initialize database schema:
```bash
pnpm run db:init
```

### Development

Start the development server:
```bash
pnpm run dev
```

The server will run on `http://localhost:3000`

### Database Commands

- Initialize/reset database schema: `pnpm run db:init`
- Reset database (same as init): `pnpm run db:reset`

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: timer_app)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration (default: 24h)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Project Structure

```
src/
├── api/           # API layer (controllers, routes, middlewares)
├── config/        # Configuration and database setup
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── app.ts         # Express app configuration
└── server.ts      # Server entry point
```