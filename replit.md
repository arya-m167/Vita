# VitaPendant Elder Safety Monitor

## Overview

VitaPendant is a mobile web application designed for elder safety monitoring. It displays real-time vital signs and health data from a wearable pendant device, including heart rate, SpO2 (blood oxygen), step count, temperature, and fall detection. The app features a clean, single-screen dashboard optimized for elderly users with large fonts and high-contrast design. It includes SOS emergency functionality and 24-hour trend visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state with 5-second polling for real-time updates
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Charts**: Recharts for heart rate trend visualization
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared code)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schema validation
- **Development**: tsx for TypeScript execution, Vite middleware for HMR

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in shared/schema.ts with Drizzle-Zod integration for type-safe validation
- **Storage**: MemStorage class for mock data simulation (generates realistic fluctuating vital signs)
- **Fall Detection**: Implements SisFall algorithm using Signal Vector Magnitude (SVM) threshold detection on simulated accelerometer data

### Key Design Patterns
- **Monorepo Structure**: Client (client/), Server (server/), and Shared code (shared/) in single repository
- **Type Sharing**: Schema types exported from shared/schema.ts, API routes from shared/routes.ts
- **Mock Data Generation**: MemStorage simulates realistic vital sign fluctuations including rare fall events (5% probability)

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations stored in /migrations directory

### UI/Component Libraries
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, toast, etc.)
- **shadcn/ui**: Pre-styled component library using Radix primitives
- **Lucide React**: Icon library

### Data & State
- **TanStack Query**: Server state management with automatic refetching
- **Zod**: Runtime type validation for API requests/responses
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **Replit plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **esbuild**: Server bundling for production builds

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but not actively used in current implementation)