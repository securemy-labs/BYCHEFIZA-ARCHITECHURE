# Frontend - Web Application

This directory contains the frontend web application for BYCHEFIZA, built as a modern Single Page Application (SPA).

## Technology Stack

**Expected technologies** (update based on actual implementation):
- Framework: React / Vue / Next.js / Nuxt / Angular
- Build tool: Vite / Webpack / Create React App
- State management: Redux / Zustand / Pinia / Context API
- Styling: CSS Modules / Tailwind CSS / Styled Components / SCSS
- Testing: Jest / Vitest / Testing Library

## Local Development

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm
- Backend services running (or configure to use remote API)

### Installation

```bash
# Navigate to frontend directory
cd apps/web

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Start Development Server

```bash
# Start development server
npm start
# or
npm run dev
# or
yarn dev

# The app should be available at http://localhost:3000 (or port shown in console)
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Environment Variables

Create a `.env.local` file (or `.env`) in this directory with the following variables:

```bash
# API Configuration (Vite example - use VITE_ prefix)
VITE_API_URL=http://localhost:3000
VITE_API_GATEWAY_URL=http://localhost:3000

# For Create React App (use REACT_APP_ prefix)
# REACT_APP_API_URL=http://localhost:3000

# For Next.js (use NEXT_PUBLIC_ prefix for client-side vars)
# NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
VITE_APP_ENV=development

# Optional: Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

**Note**: Update the variable prefix (`VITE_`, `REACT_APP_`, `NEXT_PUBLIC_`) based on your build tool.

## Docker

### Build Docker Image

```bash
# From repository root
docker build -f apps/web/Dockerfile -t bychefiza-frontend:latest .

# Or from this directory (adjust context if needed)
docker build -t bychefiza-frontend:latest .
```

### Run with Docker

```bash
# Run frontend container
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:3000 \
  bychefiza-frontend:latest

# Or use docker-compose from repository root
docker-compose up frontend
```

## Ports

- **Development**: `3000` (default, check console output)
- **Production**: Configured in deployment (commonly 80 or 3000)

## Project Structure

```
apps/web/
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (or routes)
│   ├── services/       # API services and data fetching
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   └── App.jsx         # Main app component
├── public/             # Static assets
├── tests/              # Test files
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test
```

## Notes

- **Replace placeholder commands**: Update the commands above to match your actual build tooling (Vite, CRA, Next.js, etc.)
- **Update environment variable prefixes**: Change `VITE_`, `REACT_APP_`, or `NEXT_PUBLIC_` based on your framework
- **Configure API URLs**: Point to your backend services in environment variables
- **Check package.json**: Refer to `package.json` for the complete list of available scripts
- **Docker configuration**: Create a `Dockerfile` if it doesn't exist, or update the existing one

## Troubleshooting

- **Port conflicts**: If port 3000 is in use, update the port in your configuration or environment variables
- **API connection issues**: Verify backend services are running and `VITE_API_URL` (or equivalent) is correctly set
- **Build errors**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- **Hot reload not working**: Check your build tool's configuration and file watchers

## Contributing

Follow the main repository's contributing guidelines. Ensure all tests pass before submitting a PR.

---

**Update this README with actual framework, dependencies, and commands used in your frontend application.**
