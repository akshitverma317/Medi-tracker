# Medicine Tracker

A professional, mobile-first web application for managing medication schedules for multiple patients.

## Features

- **Medicine Management**: Add, edit, and delete medicines with comprehensive details
- **Patient Profiles**: Manage multiple patients with medical conditions and allergies
- **Scheduling**: Visual daily, weekly, and monthly medicine schedules
- **Dose Tracking**: Mark medicines as taken or missed with timestamps
- **Inventory Management**: Track stock levels with automatic refill reminders
- **Reminders**: Customizable in-app notifications before dose times
- **Data Management**: Export and import data for backup and restore
- **Mobile-First Design**: Responsive UI optimized for all devices

## Tech Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server
- **date-fns** - Date manipulation
- **Vitest** - Unit testing
- **fast-check** - Property-based testing

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Project Structure

```
medicine-tracker/
├── src/
│   ├── components/
│   │   ├── layout/      # Layout components (Header, Sidebar, etc.)
│   │   └── shared/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── pages/           # Page components
│   ├── services/        # Business logic services
│   ├── types/           # Type definitions
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── __tests__/
│   ├── properties/      # Property-based tests
│   └── generators/      # Test data generators
└── public/              # Static assets
```

## Browser Support

- Chrome/Edge: last 2 versions
- Firefox: last 2 versions
- Safari: last 2 versions
- Mobile Safari: iOS 13+
- Chrome Android: last 2 versions

## License

MIT
