# Overview

Cozy Critter is a neurodivergent-friendly mood tracking application with an animal-themed interface that allows users to track their emotional wellbeing through cute animal emoji check-ins. Users can add optional personal notes to each mood entry for more detailed tracking. The app provides encouraging messages specifically tailored for neurodivergent experiences, including affirmations about masking, stimming, sensory needs, and executive function challenges. It maintains a personal mood history called "My Garden" where users can view their past mood entries and notes. All mood data is stored locally in the browser's localStorage, ensuring complete privacy as no data leaves the user's device. The app includes comprehensive accessibility features, keyboard navigation, screen reader support, and respects user motion and contrast preferences.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript and follows a component-based architecture. The application uses Vite as the build tool and development server, providing fast hot module replacement and optimized builds.

**Key architectural decisions:**
- **React with TypeScript**: Provides type safety and better developer experience while maintaining component reusability
- **Wouter for routing**: Lightweight routing solution chosen over React Router for simpler navigation needs
- **shadcn/ui component library**: Pre-built accessible components with Radix UI primitives and Tailwind CSS styling
- **TanStack Query**: Handles server state management and caching, though currently only used for client-side patterns
- **Local storage for data persistence**: All mood entries are stored in browser localStorage, ensuring complete privacy

## Backend Architecture

The backend follows an Express.js server architecture with TypeScript support. The server is designed to be extensible with a clean separation between routing, storage, and business logic.

**Key architectural decisions:**
- **Express.js with TypeScript**: Provides familiar REST API patterns with type safety
- **Modular storage interface**: Abstract storage interface allows switching between in-memory and database storage
- **Development middleware**: Integrated Vite development server for seamless full-stack development
- **ESM modules**: Modern module system for better tree-shaking and performance

## Data Storage

Currently implements a hybrid approach with client-side storage for mood data and preparation for server-side user management.

**Storage decisions:**
- **Client-side localStorage**: Mood entries are stored locally for privacy and offline capability
- **Drizzle ORM with PostgreSQL**: Prepared for future user authentication and server-side features
- **Schema validation**: Zod schemas ensure type safety between client and server
- **Migration support**: Drizzle migrations folder prepared for database schema evolution

## UI/UX Design System

The application uses a cohesive design system focused on creating a cozy, welcoming experience.

**Design decisions:**
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Custom color palette**: Warm, nature-inspired colors (neutral, brown, calm) to match the animal theme
- **Mobile-first responsive design**: Optimized for mobile devices with touch-friendly interfaces
- **CSS custom properties**: Theme system using CSS variables for consistent styling
- **Accessibility focus**: Radix UI primitives ensure proper ARIA attributes and keyboard navigation

## Development and Build Process

The project uses modern development tooling for an efficient developer experience.

**Build decisions:**
- **Vite**: Fast development server with HMR and optimized production builds
- **TypeScript**: Strict type checking across the entire codebase
- **ESBuild**: Fast bundling for server-side code
- **Path aliases**: Clean import paths using @ symbols for better code organization
- **Development scripts**: Separate dev and production environments with proper NODE_ENV handling

# External Dependencies

## Database and ORM
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and introspection tools

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings conditionally

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form

## Development and Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React support for Vite
- **tsx**: TypeScript execution for development
- **esbuild**: JavaScript bundler for production builds

## Utilities and Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation for mood entries
- **wouter**: Lightweight routing library
- **zod**: Schema validation library for type safety