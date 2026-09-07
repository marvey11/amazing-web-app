# Amazing Web App

React and TypeScript single-page application for managing Amazon wishlists.

## Tech stack

- Vite for development and production builds
- React with TypeScript
- Tailwind CSS for styling
- Vitest and Testing Library for tests
- Axios for REST API requests

## Getting started

Install dependencies with Yarn:

```bash
yarn install
```

Start the development server:

```bash
yarn start
```

The application is served at `http://localhost:3000` by default.

## Scripts

```bash
yarn typecheck      # Type-check the application
yarn lint           # Run ESLint
yarn format:check   # Check Prettier formatting
yarn test           # Run the test suite
yarn build          # Create a production build
yarn check:all      # Run all checks, build, and tests
```

Tailwind is loaded from `src/index.css` and integrated with Vite through
`@tailwindcss/vite`. Component styling should use Tailwind utility classes and
follow the existing React component patterns.
