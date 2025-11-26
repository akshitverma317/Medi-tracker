# 💊 Medicine Tracker - Complete Documentation

> A professional, mobile-first web application for managing medication schedules for multiple patients with smart reminders, inventory tracking, and comprehensive health management features.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Core Concepts](#core-concepts)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Application Architecture](#application-architecture)
9. [Data Models](#data-models)
10. [Services & Business Logic](#services--business-logic)
11. [Context Providers (State Management)](#context-providers-state-management)
12. [Pages & User Interface](#pages--user-interface)
13. [Components Library](#components-library)
14. [Utilities & Helpers](#utilities--helpers)
15. [Storage & Data Persistence](#storage--data-persistence)
16. [Notifications System](#notifications-system)
17. [Smart Alerts & Safety Features](#smart-alerts--safety-features)
18. [Styling & Design System](#styling--design-system)
19. [Testing](#testing)
20. [Browser Support](#browser-support)
21. [Deployment](#deployment)
22. [Troubleshooting](#troubleshooting)
23. [Future Enhancements](#future-enhancements)

---

## Overview

Medicine Tracker is a comprehensive healthcare management application designed to help caregivers, family members, and healthcare professionals manage medication schedules for multiple patients. The application provides:

- **Smart medication scheduling** with automatic dose generation
- **Real-time notifications** for upcoming doses
- **Inventory management** with low-stock alerts
- **Safety features** including drug interaction warnings and allergy alerts
- **Multi-patient support** for managing multiple individuals
- **Role-based access control** for different user types
- **Data export/import** for backup and portability
- **Mobile-first responsive design** that works on all devices

### Who Is This For?

- **Caregivers** managing medications for elderly or disabled individuals
- **Family members** helping loved ones stay on track with their medications
- **Healthcare facilities** tracking patient medications
- **Individuals** managing their own complex medication schedules

---

## Key Features

### 1. Patient Management
- Add and manage multiple patients
- Store patient information including age, medical conditions, and allergies
- Upload patient photos for easy identification
- Assign caregivers to patients
- View patient-specific medication schedules

### 2. Medicine Management
- Add medicines with detailed information (name, dosage, category)
- Set flexible schedules (once daily, twice daily, custom times)
- Track medicine categories (pills, liquid, injection, inhaler, other)
- Set start and end dates for medication courses
- Add special instructions and notes

### 3. Dose Tracking
- Automatic dose generation based on schedules
- Mark doses as taken, missed, or overdue
- Undo dose actions with stock adjustment
- View dose history with filters
- Track adherence rates and statistics

### 4. Smart Reminders
- Customizable reminder times (per medicine)
- Browser notifications before dose times
- Overdue dose alerts
- Low stock notifications
- Visual and audio alerts

### 5. Inventory Management
- Track stock levels for each medicine
- Automatic stock deduction when doses are taken
- Low stock threshold alerts
- Refill date calculations based on consumption
- Refill history tracking
- Inventory summary dashboard

### 6. Safety Features
- **Drug interaction warnings** - Detects potential interactions between medicines
- **Allergy alerts** - Warns if medicine conflicts with patient allergies
- **Duplicate medication detection** - Prevents adding the same medicine twice
- **Expired medication alerts** - Notifies when medicines are expired or expiring soon
- **Critical stock alerts** - Warns when medicines are out of stock

### 7. Calendar & Schedule Views
- Daily schedule view with all doses
- Weekly calendar overview
- Monthly planning view
- Filter by patient or medicine
- Color-coded status indicators

### 8. History & Reports
- Complete dose history
- Adherence statistics
- Refill records
- Filter by date range, patient, or medicine
- Export data for records

### 9. Data Management
- **Export** - Download all data as JSON backup
- **Import** - Restore from backup or merge data
- **Clear** - Reset all data (admin only)
- **Auto-save** - Changes saved automatically to browser storage

### 10. User Authentication
- Role-based login system
- Three user roles: Administrator, Caregiver, Family Member
- Permission-based feature access
- Session management with 24-hour expiry

---

## Technology Stack

### Frontend Framework
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **React Router DOM 6.28.0** - Client-side routing and navigation
- **React StrictMode** - Development mode checks for potential issues

### Styling
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **PostCSS 8.4.49** - CSS processing and autoprefixing
- **Custom Design System** - Healthcare-focused color palette and components

### Date & Time
- **date-fns 4.1.0** - Modern date utility library
  - Date formatting and parsing
  - Date arithmetic (add days, difference, etc.)
  - Week/month calculations
  - Timezone-safe operations

### Build Tools
- **Vite 6.0.3** - Fast build tool and dev server
  - Hot Module Replacement (HMR)
  - Optimized production builds
  - Code splitting
  - ES modules support

### Testing
- **Vitest 2.1.8** - Fast unit test runner
- **fast-check 3.23.1** - Property-based testing library
- **jsdom 25.0.1** - DOM implementation for testing

### Development Tools
- **ESLint** - Code linting (via Vite plugin)
- **Autoprefixer** - Automatic CSS vendor prefixing
- **TypeScript types** - Type definitions for React

---

## Getting Started

### Prerequisites
- **Node.js** 16.x or higher
- **npm** 7.x or higher (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd medicine-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages listed in `package.json`.

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Creates optimized production build in the `dist` folder.

5. **Preview production build**
   ```bash
   npm run preview
   ```
   Serves the production build locally for testing.

6. **Run tests**
   ```bash
   npm test          # Run tests once
   npm run test:watch # Run tests in watch mode
   ```

### First Time Setup

1. **Open the application** in your browser
2. **Login** with demo credentials:
   - **Administrator**: `admin` / `admin123`
   - **Caregiver**: `caregiver` / `care123`
   - **Family Member**: `family` / `family123`

3. **Add your first patient**
   - Click "Add Patient" or navigate to Patients → Add New
   - Fill in patient details (name, age, caregiver, etc.)
   - Optionally add medical conditions and allergies

4. **Add medicines for the patient**
   - Navigate to Medicines → Add New
   - Select the patient
   - Enter medicine details (name, dosage, schedule)
   - Set stock levels and reminder times

5. **Enable notifications** (optional but recommended)
   - Go to Settings
   - Enable notifications
   - Grant browser permission when prompted

---

## Project Structure

```
medicine-tracker/
├── public/                      # Static assets
├── src/
│   ├── components/             # React components
│   │   ├── layout/            # Layout components (Header, Sidebar, etc.)
│   │   │   ├── AppLayout.jsx      # Main layout wrapper
│   │   │   ├── Header.jsx         # Top navigation bar
│   │   │   ├── Sidebar.jsx        # Desktop sidebar navigation
│   │   │   └── BottomTabBar.jsx   # Mobile bottom navigation
│   │   └── shared/            # Reusable UI components
│   │       ├── Button.jsx         # Button component
│   │       ├── Input.jsx          # Input field component
│   │       ├── Card.jsx           # Card container
│   │       ├── Badge.jsx          # Status badge
│   │       ├── Select.jsx         # Dropdown select
│   │       ├── DatePicker.jsx     # Date selection
│   │       ├── TimePicker.jsx     # Time selection
│   │       ├── DoseItem.jsx       # Dose display card
│   │       ├── AlertsPanel.jsx    # Safety alerts display
│   │       ├── LoadingSpinner.jsx # Loading indicator
│   │       ├── ErrorMessage.jsx   # Error display
│   │       ├── EmptyState.jsx     # Empty state placeholder
│   │       ├── ConfirmDialog.jsx  # Confirmation modal
│   │       ├── UndoToast.jsx      # Undo action toast
│   │       └── ... (more components)
│   │
│   ├── contexts/               # React Context providers (state management)
│   │   ├── AppProviders.jsx       # Combined provider wrapper
│   │   ├── AuthContext.jsx        # Authentication state
│   │   ├── StorageContext.jsx     # Data persistence
│   │   ├── PatientContext.jsx     # Patient management
│   │   ├── MedicineContext.jsx    # Medicine management
│   │   ├── ScheduleContext.jsx    # Dose scheduling
│   │   └── InventoryContext.jsx   # Stock management
│   │
│   ├── pages/                  # Page components (routes)
│   │   ├── LoginPage.jsx          # Login screen
│   │   ├── Dashboard.jsx          # Home/today's schedule
│   │   ├── PatientListPage.jsx    # All patients list
│   │   ├── PatientDetailPage.jsx  # Single patient view
│   │   ├── AddEditPatientPage.jsx # Patient form
│   │   ├── MedicineListPage.jsx   # All medicines list
│   │   ├── AddEditMedicinePage.jsx # Medicine form
│   │   ├── CalendarPage.jsx       # Calendar view
│   │   ├── InventoryPage.jsx      # Stock management
│   │   ├── HistoryPage.jsx        # Dose history
│   │   ├── SettingsPage.jsx       # App settings
│   │   └── ComingSoon.jsx         # Placeholder page
│   │
│   ├── services/               # Business logic services
│   │   ├── StorageService.js      # Data persistence operations
│   │   ├── AlertService.js        # Safety alerts & warnings
│   │   ├── NotificationService.js # Browser notifications
│   │   ├── NotificationScheduler.js # Automatic reminders
│   │   ├── ScheduleService.js     # Dose generation logic
│   │   └── InventoryService.js    # Stock calculations
│   │
│   ├── utils/                  # Utility functions
│   │   ├── dateHelpers.js         # Date/time utilities
│   │   ├── idGenerator.js         # Unique ID generation
│   │   ├── validation.js          # Data validation
│   │   └── storagePolyfill.js     # Storage API polyfill
│   │
│   ├── types/                  # Type definitions & constants
│   │   ├── constants.js           # App-wide constants
│   │   └── index.js               # JSDoc type definitions
│   │
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles & Tailwind
│
├── __tests__/                  # Test files
│   ├── properties/             # Property-based tests
│   └── generators/             # Test data generators
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # Basic documentation
```

### Key Directories Explained

- **`components/layout/`** - Components that define the app's structure (header, sidebar, navigation)
- **`components/shared/`** - Reusable UI components used throughout the app
- **`contexts/`** - State management using React Context API
- **`pages/`** - Top-level route components (one per URL)
- **`services/`** - Business logic separated from UI components
- **`utils/`** - Helper functions for common operations
- **`types/`** - Constants and type definitions for consistency

---

## Core Concepts

### 1. Patients
A **Patient** represents an individual whose medications are being tracked.

**Patient Information:**
- Name and age
- Optional photo
- Medical conditions (e.g., "Diabetes", "Hypertension")
- Allergies (e.g., "Penicillin", "Sulfa drugs")
- Assigned caregiver name

**Why It Matters:**
- Allergies trigger safety alerts when adding medicines
- Medical conditions provide context for caregivers
- Multiple patients can be managed in one app

### 2. Medicines
A **Medicine** is a medication assigned to a specific patient with a schedule.

**Medicine Information:**
- Name (e.g., "Metformin")
- Dosage (e.g., "500mg")
- Category (pills, liquid, injection, inhaler, other)
- Frequency (once daily, twice daily, custom, etc.)
- Timings (specific times like "08:00", "20:00")
- Start date and optional end date
- Stock quantity and low stock threshold
- Reminder time (minutes before dose)
- Optional notes/instructions

**Why It Matters:**
- Timings determine when doses are scheduled
- Stock tracking prevents running out
- Reminders ensure doses aren't missed

### 3. Doses
A **Dose** is a single scheduled instance of taking a medicine.

**Dose Information:**
- Medicine and patient references
- Scheduled time (date + time)
- Status (upcoming, taken, missed, overdue)
- Actual time (when marked taken/missed)
- Optional notes

**Dose Statuses:**
- **Upcoming** - Scheduled for the future
- **Taken** - Marked as taken by user
- **Missed** - Marked as missed by user
- **Overdue** - Past scheduled time + threshold (30 minutes)

**Why It Matters:**
- Doses are automatically generated from medicine schedules
- Tracking doses provides adherence statistics
- Dose history helps identify patterns

### 4. Inventory
**Inventory** tracks the stock levels of medicines.

**Inventory Features:**
- Current stock quantity
- Low stock threshold
- Daily consumption calculation
- Refill date prediction
- Refill history

**Why It Matters:**
- Prevents running out of critical medications
- Calculates when to reorder based on consumption
- Tracks refill history for records

### 5. Schedules
A **Schedule** is the pattern of when a medicine should be taken.

**Schedule Types:**
- **Once Daily** - One time per day (default: 08:00)
- **Twice Daily** - Two times per day (default: 08:00, 20:00)
- **Three Times Daily** - Three times (default: 08:00, 14:00, 20:00)
- **Four Times Daily** - Four times (default: 08:00, 12:00, 16:00, 20:00)
- **As Needed** - No fixed schedule
- **Custom** - User-defined times

**Why It Matters:**
- Schedules automatically generate doses
- Flexible scheduling accommodates any medication regimen
- Custom times allow precise control

---

## User Roles & Permissions

The application supports three user roles with different permission levels:

### 1. Administrator (admin/admin123)
**Full Access** - Can do everything

**Permissions:**
- ✅ View all data
- ✅ Add/edit/delete patients
- ✅ Add/edit/delete medicines
- ✅ Mark doses (taken/missed)
- ✅ Manage inventory
- ✅ Export data
- ✅ Import data
- ✅ Clear all data

**Use Case:** System administrators, clinic managers

### 2. Caregiver (caregiver/care123)
**Operational Access** - Can manage day-to-day operations

**Permissions:**
- ✅ View all data
- ❌ Cannot edit/delete patients
- ✅ Add/edit medicines (but cannot delete)
- ✅ Mark doses (taken/missed)
- ✅ Manage inventory
- ✅ Export data
- ❌ Cannot import data
- ❌ Cannot clear data

**Use Case:** Nurses, professional caregivers, healthcare workers

### 3. Family Member (family/family123)
**View & Track Access** - Can view and mark doses only

**Permissions:**
- ✅ View all data
- ❌ Cannot edit/delete patients
- ❌ Cannot add/edit/delete medicines
- ✅ Mark doses (taken/missed)
- ❌ Cannot manage inventory
- ❌ Cannot export data
- ❌ Cannot import data
- ❌ Cannot clear data

**Use Case:** Family members helping with medication tracking

### How Permissions Work

Permissions are checked in two places:

1. **UI Level** - Buttons and features are hidden/disabled based on permissions
2. **Context Level** - Operations check permissions before executing

Example:
```javascript
// In a component
const { hasPermission } = useAuth()

if (hasPermission('canDeletePatients')) {
  // Show delete button
}
```

---

## Application Architecture

### Architecture Pattern: Context-Based State Management

The app uses **React Context API** for state management, organized into domain-specific contexts:

```
┌─────────────────────────────────────────────────┐
│                   App.jsx                       │
│  (Root component with Router)                   │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              AuthProvider                       │
│  (Authentication & user session)                │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│            AppProviders                         │
│  (Wraps all domain contexts)                    │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │      StorageProvider                   │    │
│  │  (Data persistence layer)              │    │
│  │  ┌──────────────────────────────────┐  │    │
│  │  │    PatientProvider               │  │    │
│  │  │  (Patient management)            │  │    │
│  │  │  ┌────────────────────────────┐  │  │    │
│  │  │  │  MedicineProvider          │  │  │    │
│  │  │  │  (Medicine management)     │  │  │    │
│  │  │  │  ┌──────────────────────┐  │  │  │    │
│  │  │  │  │  ScheduleProvider    │  │  │  │    │
│  │  │  │  │  (Dose scheduling)   │  │  │  │    │
│  │  │  │  │  ┌────────────────┐  │  │  │  │    │
│  │  │  │  │  │InventoryProvide│  │  │  │  │    │
│  │  │  │  │  │(Stock tracking)│  │  │  │  │    │
│  │  │  │  │  └────────────────┘  │  │  │  │    │
│  │  │  │  └──────────────────────┘  │  │  │    │
│  │  │  └────────────────────────────┘  │  │    │
│  │  └──────────────────────────────────┘  │    │
│  └────────────────────────────────────────┘     │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              AppLayout                          │
│  (Layout with Header, Sidebar, Content)         │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │           Page Components              │    │
│  │  (Dashboard, Patients, Medicines, etc.)│    │
│  └────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Component event handler
2. **Component** → Calls context method (e.g., `addMedicine()`)
3. **Context** → Validates data, updates state
4. **Context** → Calls StorageService to persist
5. **StorageService** → Saves to localStorage
6. **Context** → Notifies all subscribers
7. **Components** → Re-render with new data

### Service Layer

Services contain business logic separated from UI:

- **StorageService** - Data persistence (save/load/export/import)
- **AlertService** - Safety checks (drug interactions, allergies)
- **NotificationService** - Browser notifications
- **NotificationScheduler** - Automatic reminder scheduling
- **ScheduleService** - Dose generation algorithms
- **InventoryService** - Stock calculations

**Why Services?**
- Keeps components focused on UI
- Makes business logic testable
- Allows logic reuse across components
- Easier to maintain and modify

---

## Data Models

### Patient Model

```javascript
{
  id: "1234567890-abc123",           // Unique identifier
  name: "John Doe",                   // Patient name
  age: 75,                            // Age in years
  photo: "data:image/jpeg;base64...", // Optional photo (base64)
  medicalConditions: [                // Array of conditions
    "Type 2 Diabetes",
    "Hypertension"
  ],
  allergies: [                        // Array of allergies
    "Penicillin",
    "Sulfa drugs"
  ],
  caregiverName: "Jane Smith",        // Assigned caregiver
  createdAt: "2024-01-15T10:30:00Z",  // Creation timestamp
  updatedAt: "2024-01-20T14:45:00Z"   // Last update timestamp
}
```

### Medicine Model

```javascript
{
  id: "1234567890-def456",              // Unique identifier
  patientId: "1234567890-abc123",       // Reference to patient
  name: "Metformin",                    // Medicine name
  dosage: "500mg",                      // Dosage information
  frequency: "twice-daily",             // Frequency type
  timings: ["08:00", "20:00"],          // Array of times (HH:MM)
  category: "pills",                    // Category type
  notes: "Take with food",              // Optional instructions
  stockQuantity: 60,                    // Current stock count
  lowStockThreshold: 10,                // Alert threshold
  reminderMinutesBefore: 15,            // Reminder time
  startDate: "2024-01-15",              // Start date (YYYY-MM-DD)
  endDate: "2024-03-15",                // Optional end date
  createdAt: "2024-01-15T10:30:00Z",    // Creation timestamp
  updatedAt: "2024-01-20T14:45:00Z"     // Last update timestamp
}
```

### Dose Record Model

```javascript
{
  id: "1234567890-ghi789",              // Unique identifier
  medicineId: "1234567890-def456",      // Reference to medicine
  patientId: "1234567890-abc123",       // Reference to patient
  scheduledTime: "2024-01-20T08:00:00Z", // Scheduled datetime
  status: "taken",                      // Status: upcoming/taken/missed/overdue
  actualTime: "2024-01-20T08:05:00Z",   // When marked (if taken/missed)
  notes: "Taken with breakfast"         // Optional notes
}
```

### Refill Record Model

```javascript
{
  id: "1234567890-jkl012",              // Unique identifier
  medicineId: "1234567890-def456",      // Reference to medicine
  date: "2024-01-20",                   // Refill date (YYYY-MM-DD)
  quantityAdded: 30,                    // Number of doses added
  notes: "Refilled at pharmacy"         // Optional notes
}
```

### App Settings Model

```javascript
{
  defaultReminderMinutes: 15,           // Default reminder time
  defaultLowStockThreshold: 5,          // Default stock threshold
  theme: "light",                       // UI theme (light/dark)
  notificationsEnabled: true            // Notifications on/off
}
```

---

## Services & Business Logic

### 1. StorageService

**Purpose:** Handles all data persistence using browser's localStorage.

**Key Methods:**

```javascript
// Check if storage is available
isStorageAvailable() → boolean

// Create initial empty state
createInitialState() → AppState

// Save data to storage
saveData(data) → Promise<{success, error?}>

// Load data from storage
loadData() → Promise<{success, data?, error?}>

// Export data as JSON blob
exportData(data) → {success, blob?, error?}

// Import data from JSON string
importData(jsonString) → {success, data?, errors?}

// Validate imported data structure
validateImportData(data) → {valid, errors}

// Clear all data
clearData() → Promise<{success, error?}>
```

**How It Works:**
1. Uses `window.storage` API (polyfilled to localStorage)
2. Stores data as JSON string with version info
3. Validates data structure on import
4. Provides graceful fallback if storage unavailable

### 2. AlertService

**Purpose:** Provides safety checks for drug interactions, allergies, and other warnings.

**Key Methods:**

```javascript
// Check for drug interactions between medicines
checkDrugInteractions(newMedicine, existingMedicines) → Alert[]

// Check if medicine conflicts with patient allergies
checkAllergyConflicts(medicine, patientAllergies) → Alert[]

// Check for duplicate medications
checkDuplicateMedications(newMedicine, existingMedicines) → Alert[]

// Check for expired medications
checkExpiredMedications(medicines) → Alert[]

// Check for critical low stock
checkCriticalStock(medicines) → Alert[]

// Get all alerts for a patient
getAllAlerts(patient, medicines) → Alert[]
```

**Alert Types:**
- **Drug Interaction** (high severity) - Potential medicine interactions
- **Allergy** (critical severity) - Medicine conflicts with allergy
- **Duplicate** (medium severity) - Same medicine already exists
- **Expired** (high severity) - Medicine past end date
- **Expiring Soon** (medium severity) - Medicine expires within 7 days
- **Out of Stock** (critical severity) - No doses remaining
- **Low Stock** (high severity) - Below threshold

**Built-in Drug Interaction Database:**
- Warfarin interactions (aspirin, ibuprofen, etc.)
- Aspirin interactions
- Metformin interactions
- Lisinopril interactions
- And more common medications

### 3. NotificationService

**Purpose:** Manages browser notifications for medication reminders.

**Key Methods:**

```javascript
// Check current notification permission
checkPermission() → 'granted' | 'denied' | 'default'

// Request notification permission from user
requestPermission() → Promise<boolean>

// Show a notification
showNotification(title, options) → Notification

// Show medication reminder
showMedicationReminder(medicine, patient, scheduledTime) → Notification

// Show overdue alert
showOverdueAlert(medicine, patient, scheduledTime) → Notification

// Show low stock alert
showLowStockAlert(medicine, stockQuantity) → Notification

// Show critical alert
showCriticalAlert(title, message, data) → Notification

// Schedule notification for specific time
scheduleNotification(scheduledTime, callback) → timeoutId

// Cancel scheduled notification
cancelNotification(timeoutId) → void

// Play notification sound
playNotificationSound() → void
```

**How It Works:**
1. Checks browser notification support
2. Requests permission on first use
3. Creates native browser notifications
4. Includes action buttons (mark taken, snooze)
5. Plays sound for important alerts

### 4. NotificationScheduler

**Purpose:** Automatically schedules and sends medication reminders.

**Key Methods:**

```javascript
// Start the scheduler
start(scheduleContext, medicineContext, patientContext) → void

// Stop the scheduler
stop() → void

// Set reminder time (minutes before dose)
setReminderMinutes(minutes) → void

// Check and schedule notifications
checkAndScheduleNotifications() → void

// Send medication reminder
sendMedicationReminder(dose, reminderMinutes, isNow) → void

// Get scheduler status
getStatus() → {isRunning, scheduledCount, reminderMinutes}
```

**How It Works:**
1. Runs every 60 seconds checking for upcoming doses
2. Schedules notifications X minutes before each dose
3. Uses medicine-specific reminder times
4. Automatically cleans up past notifications
5. Sends immediate notification when dose time arrives

### 5. ScheduleService

**Purpose:** Business logic for dose generation and scheduling.

**Key Methods:**

```javascript
// Get default timings for frequency
getDefaultTimingsForFrequency(frequency) → string[]

// Calculate dose status
calculateDoseStatus(scheduledTime, currentStatus) → string

// Generate doses for medicine on specific date
generateDosesForMedicineOnDate(medicine, dateStr, existingDoses) → DoseRecord[]

// Generate doses for all medicines on date
generateDosesForDate(medicines, dateStr, existingDoses) → DoseRecord[]

// Generate doses for date range
generateDosesForDateRange(medicines, startDate, endDate, existingDoses) → DoseRecord[]

// Sort doses chronologically
sortDosesChronologically(doses, ascending) → DoseRecord[]

// Filter doses by status
filterDosesByStatus(doses, status) → DoseRecord[]

// Get weekly doses
getWeeklyDoses(medicines, existingDoses) → DoseRecord[]

// Get monthly doses
getMonthlyDoses(medicines, existingDoses) → DoseRecord[]

// Calculate adherence statistics
calculateAdherenceStats(doses) → {total, taken, missed, overdue, upcoming, adherenceRate}
```

**Dose Generation Logic:**
1. Checks if date is within medicine's active period
2. Creates dose for each timing in the schedule
3. Checks for existing dose records (don't duplicate)
4. Calculates status based on current time
5. Returns array of dose records

### 6. InventoryService

**Purpose:** Business logic for stock tracking and refill calculations.

**Key Methods:**

```javascript
// Calculate daily consumption rate
calculateDailyConsumption(medicine) → number

// Calculate days remaining until stock runs out
calculateDaysRemaining(stockQuantity, dailyConsumption) → number

// Calculate refill date
calculateRefillDate(medicine) → string | null

// Check if medicine is low on stock
isLowStock(medicine) → boolean

// Check if medicine is out of stock
isOutOfStock(medicine) → boolean

// Check if medicine needs refill soon
needsRefillSoon(medicine, daysThreshold) → boolean

// Project stock after X days
projectStockAfterDays(currentStock, dailyConsumption, days) → number

// Calculate required refill quantity
calculateRequiredRefillQuantity(medicine, targetDays) → number

// Get inventory alerts
getInventoryAlerts(medicine) → Alert[]

// Get inventory summary
getInventorySummary(medicines) → {totalMedicines, lowStockCount, ...}

// Sort by stock level
sortByStockLevel(medicines, ascending) → Medicine[]

// Sort by refill urgency
sortByRefillUrgency(medicines) → Medicine[]
```

**Stock Calculation Example:**
```
Medicine: Metformin 500mg
Timings: 08:00, 20:00 (2 times per day)
Current Stock: 30 doses

Daily Consumption = 2 doses/day
Days Remaining = 30 / 2 = 15 days
Refill Date = Today + 15 days
```

---

## Context Providers (State Management)

### 1. AuthContext

**Purpose:** Manages user authentication and permissions.

**State:**
- `isAuthenticated` - Whether user is logged in
- `isLoading` - Auth check in progress
- `user` - Current user object with role and permissions

**Methods:**
```javascript
login(credentials) → {success, error?}
logout() → void
hasPermission(permission) → boolean
hasRole(role) → boolean
```

**Usage:**
```javascript
const { isAuthenticated, user, login, logout, hasPermission } = useAuth()

if (hasPermission('canDeletePatients')) {
  // Show delete button
}
```

### 2. StorageContext

**Purpose:** Manages data persistence and provides app state.

**State:**
- `appState` - Complete application data
- `isLoading` - Data loading in progress
- `error` - Error message if any
- `isStorageAvailable` - Whether storage is working

**Methods:**
```javascript
saveData(newState) → Promise<{success, error?}>
updateState(updates) → void
exportData() → {success, blob?, error?}
importData(jsonString, mode) → Promise<{success, error?}>
clearAllData() → Promise<{success, error?}>
```

**Usage:**
```javascript
const { appState, isLoading, updateState } = useStorage()

// Update state
updateState({ patients: updatedPatients })
```

### 3. PatientContext

**Purpose:** Manages patient data and operations.

**State:**
- `patients` - Array of all patients
- `selectedPatientId` - Currently selected patient ID
- `selectedPatient` - Currently selected patient object

**Methods:**
```javascript
getPatient(id) → Patient | null
addPatient(patientData) → {success, patient?, errors?}
updatePatient(id, updates) → {success, patient?, errors?}
deletePatient(id) → {success, deletedPatient?, error?}
selectPatient(id) → {success, error?}
```

**Usage:**
```javascript
const { patients, selectedPatient, addPatient } = usePatients()

const result = addPatient({
  name: "John Doe",
  age: 75,
  caregiverName: "Jane Smith",
  medicalConditions: ["Diabetes"],
  allergies: ["Penicillin"]
})
```

### 4. MedicineContext

**Purpose:** Manages medicine data and operations.

**State:**
- `medicines` - Array of all medicines

**Methods:**
```javascript
getMedicine(id) → Medicine | null
getMedicinesByPatient(patientId) → Medicine[]
addMedicine(medicineData) → {success, medicine?, errors?}
updateMedicine(id, updates) → {success, medicine?, errors?}
deleteMedicine(id) → {success, deletedMedicine?, error?}
updateStock(medicineId, newQuantity) → {success, error?}
decrementStock(medicineId) → {success, error?}
getLowStockMedicines() → Medicine[]
searchMedicines(query) → Medicine[]
sortMedicines(medicineList, sortBy) → Medicine[]
checkDuplicates(name, dosage, excludeId?) → Medicine[]
```

**Usage:**
```javascript
const { medicines, addMedicine, getMedicinesByPatient } = useMedicines()

const patientMedicines = getMedicinesByPatient(patientId)
```

### 5. ScheduleContext

**Purpose:** Manages dose scheduling and tracking.

**State:**
- `doseRecords` - Array of all dose records

**Methods:**
```javascript
getDoseRecord(id) → DoseRecord | null
generateDosesForDate(medicine, dateStr) → DoseRecord[]
getDosesForDate(dateStr, patientId?) → DoseRecord[]
getTodayDoses(patientId?) → DoseRecord[]
getDailySchedule(dateStr, patientId?) → DoseRecord[]
markDoseTaken(doseIdOrDose, notes?) → {success, dose?, error?}
markDoseMissed(doseIdOrDose, notes?) → {success, dose?, error?}
undoDose(doseIdOrDose) → {success, dose?, error?}
getDoseHistory(filters?) → DoseRecord[]
getUpcomingDoses(patientId?, limit?) → DoseRecord[]
getOverdueDoses(patientId?) → DoseRecord[]
```

**Usage:**
```javascript
const { getTodayDoses, markDoseTaken } = useSchedule()

const todayDoses = getTodayDoses()

// Mark dose as taken
markDoseTaken(dose.id, "Taken with breakfast")
```

### 6. InventoryContext

**Purpose:** Manages inventory and refill operations.

**State:**
- `refillRecords` - Array of all refill records

**Methods:**
```javascript
getRefillsByMedicine(medicineId) → RefillRecord[]
calculateDailyConsumption(medicine) → number
calculateRefillDate(medicineId) → string | null
addRefill(medicineId, quantityAdded, notes?) → {success, refillRecord?, error?}
updateRefill(refillId, quantityAdded, notes?) → {success, refillRecord?, error?}
deleteRefill(refillId) → {success, deletedRefill?, error?}
getLowStockMedicines() → Medicine[]
getMedicinesNeedingRefill(daysThreshold?) → Medicine[]
getInventorySummary() → {totalMedicines, lowStockCount, ...}
updateStock(medicineId, newQuantity) → {success, error?}
```

**Usage:**
```javascript
const { addRefill, getLowStockMedicines } = useInventory()

// Add refill
addRefill(medicineId, 30, "Refilled at pharmacy")

// Get low stock medicines
const lowStock = getLowStockMedicines()
```

---

## Pages & User Interface

### 1. LoginPage (`/`)

**Purpose:** User authentication screen.

**Features:**
- Username and password input
- Demo credentials display
- Role-based login (admin, caregiver, family)
- Session management (24-hour expiry)
- Animated gradient background
- Mobile-responsive design

**Demo Accounts:**
- Administrator: `admin` / `admin123`
- Caregiver: `caregiver` / `care123`
- Family Member: `family` / `family123`

### 2. Dashboard (`/`)

**Purpose:** Home screen showing today's schedule.

**Features:**
- Today's date display
- Smart alerts panel (drug interactions, allergies)
- Low stock warnings
- Doses grouped by status (overdue, upcoming, taken, missed)
- Quick statistics (total, taken, upcoming, overdue)
- Quick add medicine button
- Empty state when no doses scheduled

**Dose Actions:**
- Mark as taken
- Mark as missed
- Undo action (with 10-second timeout)

### 3. PatientListPage (`/patients`)

**Purpose:** View and manage all patients.

**Features:**
- List of all patients with photos
- Patient cards showing name, age, caregiver
- Medicine count per patient
- Search patients by name
- Add new patient button
- Edit/delete patient actions (permission-based)
- Empty state when no patients

### 4. PatientDetailPage (`/patients/:id`)

**Purpose:** Detailed view of a single patient.

**Features:**
- Patient information display
- Medical conditions and allergies
- List of assigned medicines
- Today's doses for this patient
- Smart alerts specific to patient
- Edit patient button
- Delete patient button (with confirmation)
- Navigate to add medicine for this patient

### 5. AddEditPatientPage (`/patients/add` or `/patients/:id/edit`)

**Purpose:** Form to add or edit patient information.

**Features:**
- Name input (required, 1-100 characters)
- Age input (required, 0-150)
- Photo upload (optional, base64 encoding)
- Medical conditions (multi-input)
- Allergies (multi-input)
- Caregiver name (required)
- Form validation with error messages
- Save and cancel buttons
- Auto-save on successful submission

**Validation Rules:**
- Name: Required, 1-100 characters
- Age: Required, 0-150, whole number
- Caregiver: Required, 1-100 characters
- Medical conditions: Optional array
- Allergies: Optional array

### 6. MedicineListPage (`/medicines`)

**Purpose:** View and manage all medicines.

**Features:**
- List of all medicines with details
- Medicine cards showing name, dosage, patient, schedule
- Stock level indicators
- Search medicines by name
- Filter by patient
- Sort by name, patient, time, stock
- Add new medicine button
- Edit/delete medicine actions (permission-based)
- Empty state when no medicines

### 7. AddEditMedicinePage (`/medicines/add` or `/medicines/:id/edit`)

**Purpose:** Form to add or edit medicine information.

**Features:**
- Patient selection (required)
- Medicine name (required, 1-200 characters)
- Dosage (required, 1-100 characters)
- Category selection (pills, liquid, injection, inhaler, other)
- Frequency selection (once daily, twice daily, etc.)
- Custom timing inputs (HH:MM format)
- Start date (required)
- End date (optional)
- Stock quantity (required, minimum 0)
- Low stock threshold (required, minimum 0)
- Reminder time (required, minutes before dose)
- Notes (optional)
- Duplicate detection warning
- Drug interaction warnings
- Allergy conflict warnings
- Form validation with error messages

**Validation Rules:**
- Name: Required, 1-200 characters
- Dosage: Required, 1-100 characters
- Frequency: Required, valid option
- Timings: At least one time, valid HH:MM format
- Category: Required, valid option
- Patient: Required
- Stock: Required, >= 0
- Threshold: Required, >= 0
- Reminder: Required, >= 0 minutes
- Start date: Required
- End date: Optional, must be after start date

### 8. CalendarPage (`/calendar`)

**Purpose:** Calendar view of medication schedule.

**Features:**
- Month view calendar
- Week view option
- Day view option
- Doses displayed on calendar dates
- Color-coded by status
- Click date to see details
- Navigate between months/weeks
- Filter by patient
- Today button to jump to current date

### 9. InventoryPage (`/inventory`)

**Purpose:** Manage medicine stock levels.

**Features:**
- List of all medicines with stock info
- Current stock quantity display
- Low stock indicators
- Days until refill calculation
- Refill date prediction
- Add refill button
- Refill history per medicine
- Sort by stock level or urgency
- Filter low stock only
- Quick refill actions
- Stock adjustment

**Refill Actions:**
- Add refill (quantity + notes)
- Edit refill record
- Delete refill record
- View refill history

### 10. HistoryPage (`/history`)

**Purpose:** View dose history and adherence.

**Features:**
- Complete dose history
- Filter by patient
- Filter by medicine
- Filter by status (taken, missed)
- Filter by date range
- Adherence statistics
- Adherence rate percentage
- Export history (CSV or JSON)
- Sort by date (newest/oldest first)
- Pagination for large datasets

**Statistics Shown:**
- Total doses
- Doses taken
- Doses missed
- Adherence rate (%)
- By patient breakdown
- By medicine breakdown
- By date range

### 11. SettingsPage (`/settings`)

**Purpose:** Application settings and data management.

**Features:**
- **Notification Settings**
  - Enable/disable notifications
  - Request notification permission
  - Test notification
  - Default reminder time

- **Data Management**
  - Export all data (JSON)
  - Import data (replace or merge)
  - Clear all data (admin only)
  - Data validation on import

- **User Profile**
  - Current user info
  - Role and permissions display
  - Logout button

- **App Information**
  - Version number
  - Storage status
  - Data size
  - Last backup date

### 12. ComingSoon

**Purpose:** Placeholder for future features.

**Features:**
- Friendly message
- Return to dashboard button
- Feature request link (optional)

---

## Components Library

### Layout Components

#### AppLayout
Main layout wrapper with responsive navigation.
- Desktop: Sidebar + Header + Content
- Mobile: Header + Content + Bottom Tab Bar

#### Header
Top navigation bar with:
- App logo and title
- Patient selector dropdown
- User menu (profile, logout)
- Notification bell icon
- Mobile menu toggle

#### Sidebar (Desktop)
Left sidebar navigation with:
- Navigation links (Dashboard, Patients, Medicines, etc.)
- Active route highlighting
- Icons for each section
- Collapsible on smaller screens

#### BottomTabBar (Mobile)
Bottom navigation bar with:
- 5 main tabs (Home, Patients, Medicines, Calendar, More)
- Icons and labels
- Active tab highlighting
- Touch-friendly 44px minimum height

### Shared Components

#### Button
Reusable button component with variants:
- **Variants:** primary, secondary, success, danger, warning
- **Sizes:** small, normal, large
- **Props:** fullWidth, disabled, loading
- **Accessibility:** Touch-friendly (44px min), focus states

#### Input
Text input field with:
- Label and error message support
- Various types (text, password, email, number, date, time)
- Validation state styling
- Placeholder text
- Required indicator
- Touch-friendly (44px min height)

#### Select
Dropdown selection with:
- Label and error message support
- Option groups
- Placeholder option
- Validation state styling
- Touch-friendly

#### Card
Container component with:
- Optional title
- Optional subtitle
- Padding variants (none, small, normal, large)
- Shadow and border styling
- Responsive design

#### Badge
Status indicator with:
- Color variants (upcoming, taken, missed, overdue)
- Size variants (small, normal, large)
- Icon support
- Rounded pill shape

#### DatePicker
Date selection component with:
- Calendar popup
- Min/max date constraints
- Date format display
- Keyboard navigation
- Touch-friendly

#### TimePicker
Time selection component with:
- Hour and minute inputs
- 24-hour format (HH:MM)
- Validation
- Touch-friendly

#### DoseItem
Dose display card showing:
- Medicine name and dosage
- Patient name
- Scheduled time
- Status badge
- Action buttons (mark taken, mark missed, undo)
- Notes display
- Expandable details

#### AlertsPanel
Safety alerts display with:
- Alert severity indicators (critical, high, medium, low)
- Alert type icons
- Alert messages
- Expandable details
- Dismiss action
- Color-coded by severity

#### LoadingSpinner
Loading indicator with:
- Size variants (small, normal, large)
- Color variants
- Centered or inline
- Fullscreen option
- Optional text message

#### ErrorMessage
Error display component with:
- Variant types (danger, warning, info)
- Title and message
- Icon display
- Dismissible option
- Animation on appear

#### EmptyState
Empty state placeholder with:
- Icon/emoji display
- Title and message
- Optional action button
- Centered layout
- Friendly messaging

#### ConfirmDialog
Confirmation modal with:
- Title and message
- Confirm and cancel buttons
- Danger variant for destructive actions
- Keyboard support (Enter/Escape)
- Backdrop click to close

#### UndoToast
Undo action notification with:
- Slide-up animation
- Countdown timer (10 seconds)
- Undo button
- Auto-dismiss
- Bottom-center positioning

#### FormField
Form field wrapper with:
- Label
- Input/Select/Textarea
- Error message
- Help text
- Required indicator
- Consistent spacing

#### ImageUpload
Image upload component with:
- Drag and drop support
- File input fallback
- Image preview
- Base64 encoding
- Size validation
- Format validation (JPEG, PNG)
- Remove image button

#### NotificationSettings
Notification settings panel with:
- Enable/disable toggle
- Permission status display
- Request permission button
- Test notification button
- Reminder time setting

#### DuplicateMedicineDialog
Duplicate warning modal with:
- List of similar medicines
- Comparison details
- Continue or cancel options
- Warning styling

---

## Utilities & Helpers

### dateHelpers.js

Date and time utility functions using date-fns:

```javascript
// Format date to YYYY-MM-DD
formatDateISO(date) → string

// Format time to HH:MM
formatTime(date) → string

// Combine date and time strings into ISO datetime
combineDateAndTime(dateStr, timeStr) → string

// Get start of day
getStartOfDay(date) → Date

// Get end of day
getEndOfDay(date) → Date

// Check if datetime is overdue
isOverdue(scheduledTime, thresholdMinutes) → boolean

// Check if datetime is upcoming
isUpcoming(scheduledTime) → boolean

// Calculate reminder time
calculateReminderTime(scheduledTime, minutesBefore) → string

// Check if two dates are same day
isSameDay(date1, date2) → boolean

// Get today's date as ISO string
getTodayISO() → string

// Parse ISO datetime to Date object
parseISODate(isoString) → Date
```

### idGenerator.js

Unique ID generation:

```javascript
// Generate unique ID (timestamp + random string)
generateId() → string
// Example: "1234567890-abc123def"
```

### validation.js

Data validation functions with detailed error messages:

```javascript
// Validate time format (HH:MM)
validateTimeFormat(time) → {valid, error?}

// Validate medicine category
validateMedicineCategory(category) → {valid, error?}

// Validate medicine frequency
validateMedicineFrequency(frequency) → {valid, error?}

// Validate complete medicine data
validateMedicine(medicine) → {valid, errors}

// Validate complete patient data
validatePatient(patient) → {valid, errors}

// Validate dose status
validateDoseStatus(status) → {valid, error?}

// Validate dose record data
validateDoseRecord(doseRecord) → {valid, errors}

// Validate refill record data
validateRefillRecord(refillRecord) → {valid, errors}
```

**Validation Constants:**
```javascript
VALIDATION = {
  PATIENT_NAME_MIN: 1,
  PATIENT_NAME_MAX: 100,
  PATIENT_AGE_MIN: 0,
  PATIENT_AGE_MAX: 150,
  CAREGIVER_NAME_MIN: 1,
  CAREGIVER_NAME_MAX: 100,
  MEDICINE_NAME_MIN: 1,
  MEDICINE_NAME_MAX: 200,
  DOSAGE_MIN: 1,
  DOSAGE_MAX: 100,
  STOCK_MIN: 0,
  THRESHOLD_MIN: 0,
  REMINDER_MIN: 0,
  TIME_REGEX: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
}
```

### storagePolyfill.js

Creates `window.storage` API using localStorage:

```javascript
// Initialize storage polyfill
initializeStoragePolyfill() → void
```

**What It Does:**
1. Checks if `window.storage` exists
2. If not, creates it using localStorage
3. If localStorage unavailable, creates in-memory fallback
4. Provides consistent API across browsers

**API Methods:**
- `getItem(key)` - Get value
- `setItem(key, value)` - Set value
- `removeItem(key)` - Remove value
- `clear()` - Clear all
- `length` - Number of items
- `key(index)` - Get key at index

---

## Storage & Data Persistence

### Storage Mechanism

The app uses **browser localStorage** for data persistence:

1. **Storage Key:** `medicine-tracker-data`
2. **Format:** JSON string
3. **Structure:**
   ```json
   {
     "version": "1.0.0",
     "lastModified": "2024-01-20T10:30:00Z",
     "patients": [...],
     "medicines": [...],
     "doseRecords": [...],
     "refillRecords": [...],
     "settings": {...}
   }
   ```

### Auto-Save Behavior

- **When:** Every state change (add, edit, delete)
- **How:** Asynchronous save to localStorage
- **Error Handling:** Shows error message if save fails
- **Fallback:** In-memory state if storage unavailable

### Data Export

**Format:** JSON file
**Filename:** `medicine-tracker-backup-YYYY-MM-DD.json`
**Contents:** Complete app state with metadata

**How to Export:**
1. Go to Settings page
2. Click "Export Data" button
3. File downloads automatically

### Data Import

**Modes:**
- **Replace:** Overwrites all existing data
- **Merge:** Combines with existing data

**Validation:**
- Checks JSON format
- Validates data structure
- Validates required fields
- Shows detailed error messages

**How to Import:**
1. Go to Settings page
2. Click "Import Data" button
3. Select JSON file
4. Choose mode (replace or merge)
5. Confirm import

### Data Clearing

**Who Can:** Administrator only
**What Happens:**
- All patients deleted
- All medicines deleted
- All dose records deleted
- All refill records deleted
- Settings reset to defaults

**How to Clear:**
1. Go to Settings page
2. Click "Clear All Data" button
3. Confirm action (requires typing "DELETE")
4. Data cleared and app resets

### Storage Limits

**localStorage Limit:** ~5-10 MB (browser-dependent)

**Estimated Capacity:**
- ~1,000 patients
- ~10,000 medicines
- ~100,000 dose records
- ~10,000 refill records

**If Limit Reached:**
- Export data regularly
- Clear old dose records
- Use import/export for archiving

---

## Notifications System

### Browser Notifications

The app uses the **Web Notifications API** for medication reminders.

### Permission Flow

1. **First Visit:** Permission is "default" (not asked)
2. **User Enables:** App requests permission
3. **User Grants:** Notifications enabled
4. **User Denies:** Notifications disabled (can re-enable in browser settings)

### Notification Types

#### 1. Medication Reminder
**When:** X minutes before dose time (per medicine setting)
**Title:** "💊 Time to take [Medicine Name]"
**Body:** "[Patient Name] - [Dosage]\nScheduled for [Time]"
**Actions:** Mark as Taken, Snooze 10 min

#### 2. Dose Time Notification
**When:** At exact dose time
**Title:** "💊 Time to take [Medicine Name]!"
**Body:** "[Patient Name] - [Dosage]\nScheduled for [Time]"
**Persistent:** Yes (requires interaction)

#### 3. Overdue Alert
**When:** Dose is overdue (30+ minutes past scheduled time)
**Title:** "⚠️ Overdue: [Medicine Name]"
**Body:** "[Patient Name] missed the [Time] dose"
**Persistent:** Yes (requires interaction)

#### 4. Low Stock Alert
**When:** Stock falls below threshold
**Title:** "📦 Low Stock: [Medicine Name]"
**Body:** "Only [X] doses remaining\nTime to refill!"

#### 5. Critical Alert
**When:** Important safety warnings
**Title:** "🚨 [Alert Title]"
**Body:** "[Alert Message]"
**Persistent:** Yes (requires interaction)

### Notification Scheduler

**How It Works:**
1. Runs every 60 seconds
2. Checks for upcoming doses
3. Schedules notifications X minutes before
4. Sends notification at scheduled time
5. Cleans up past notifications

**Per-Medicine Reminder Times:**
- Each medicine has its own reminder setting
- Default: 15 minutes before
- Range: 0-120 minutes

**Example:**
```
Medicine: Metformin 500mg
Reminder: 15 minutes before
Dose Time: 08:00

Notification sent at: 07:45
```

### Notification Settings

**Enable/Disable:**
- Settings page → Notification Settings
- Toggle on/off
- Persists across sessions

**Test Notification:**
- Settings page → Test Notification button
- Sends sample notification
- Verifies notifications are working

**Browser Settings:**
- Users can manage permissions in browser settings
- Chrome: Settings → Privacy → Site Settings → Notifications
- Firefox: Settings → Privacy → Permissions → Notifications
- Safari: Preferences → Websites → Notifications

---

## Smart Alerts & Safety Features

### Drug Interaction Detection

**Built-in Database:**
The app includes a database of common drug interactions:

- Warfarin ↔ Aspirin, Ibuprofen, Naproxen, Vitamin K
- Aspirin ↔ Warfarin, Ibuprofen, Naproxen, Clopidogrel
- Metformin ↔ Alcohol, Contrast Dye
- Lisinopril ↔ Potassium, Spironolactone
- Levothyroxine ↔ Calcium, Iron, Antacids
- Simvastatin ↔ Grapefruit, Clarithromycin, Itraconazole
- And more...

**How It Works:**
1. When adding/editing medicine
2. Checks name against interaction database
3. Compares with patient's other medicines
4. Shows warning if interaction found
5. User can proceed with caution or cancel

### Allergy Conflict Detection

**Allergen Keywords:**
The app checks for common allergen patterns:

- Penicillin → Amoxicillin, Ampicillin, Penicillin
- Sulfa → Sulfamethoxazole, Sulfasalazine, Sulfa
- Aspirin → Aspirin, ASA, Acetylsalicylic
- NSAID → Ibuprofen, Naproxen, Diclofenac, Celecoxib
- Latex → Latex
- Iodine → Iodine, Contrast

**How It Works:**
1. When adding/editing medicine
2. Checks medicine name against patient allergies
3. Checks for keyword matches
4. Shows CRITICAL alert if match found
5. Prevents accidental administration

**Alert Example:**
```
🚨 ALLERGY ALERT
Patient is allergic to Penicillin
Amoxicillin may contain or be related to Penicillin.
DO NOT ADMINISTER without consulting a doctor.
```

### Duplicate Medicine Detection

**Checks:**
- Exact name match
- Similar name match (first 5 characters)
- Same name + same dosage

**How It Works:**
1. When adding medicine
2. Compares with existing medicines for same patient
3. Shows warning if duplicate found
4. User can proceed or cancel

**Alert Example:**
```
⚠️ Duplicate Medication
Metformin 500mg is already in the medication list
This patient is already taking this medication.
Adding it again may result in double dosing.
```

### Expired Medication Alerts

**Checks:**
- Medicine past end date
- Medicine expiring within 7 days

**How It Works:**
1. Runs on dashboard load
2. Checks all medicines for end dates
3. Shows alert if expired or expiring soon
4. Suggests removal or renewal

**Alert Types:**
- **Expired:** "Medicine expired X days ago"
- **Expiring Soon:** "Medicine expires in X days"

### Critical Stock Alerts

**Checks:**
- Out of stock (quantity = 0)
- Low stock (quantity ≤ threshold)

**How It Works:**
1. Runs on dashboard and inventory page
2. Checks all medicines for stock levels
3. Shows alert if critical
4. Calculates refill urgency

**Alert Types:**
- **Out of Stock:** "No doses remaining. Refill immediately."
- **Low Stock:** "Only X doses left. Refill soon."

---

## Styling & Design System

### Color Palette

**Healthcare-Focused Colors:**

#### Primary (Blue)
- Used for: Main actions, links, active states
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Base: `#0073e6`

#### Success (Green)
- Used for: Taken doses, positive actions, confirmations
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Base: `#00a550`

#### Warning (Yellow/Orange)
- Used for: Overdue doses, cautions, low stock
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Base: `#e6b000`

#### Danger (Red)
- Used for: Missed doses, errors, critical alerts, delete actions
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Base: `#e60000`

#### Neutral (Gray)
- Used for: Text, backgrounds, borders
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Base: `#6c757d`

### Typography

**Font Family:**
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
sans-serif
```

**Font Sizes:**
- Base: 16px (minimum for accessibility)
- Large: 18px
- XL: 20px
- 2XL: 24px
- 3XL: 30px
- 4XL: 36px

**Font Weights:**
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing

**Touch-Friendly Spacing:**
- Minimum touch target: 44px × 44px
- Button padding: 16px horizontal, 8px vertical
- Card padding: 16px
- Section spacing: 24px

### Components

**Buttons:**
```css
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}
```

**Inputs:**
```css
.input {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  min-height: 44px;
  font-size: 16px;
}
```

**Cards:**
```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 16px;
}
```

**Badges:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
}
```

### Animations

**Slide Up:**
```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**Slide Down:**
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Shake:**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile-First Approach:**
- Base styles for mobile
- Media queries for larger screens
- Touch-friendly interactions
- Bottom navigation on mobile
- Sidebar navigation on desktop

### Accessibility

**WCAG 2.1 Compliance:**
- Minimum 16px font size
- 44px minimum touch targets
- Color contrast ratios meet AA standards
- Focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader friendly markup
- ARIA labels where needed

---

## Testing

### Unit Testing

**Framework:** Vitest
**Location:** `__tests__/` directory

**Running Tests:**
```bash
npm test          # Run once
npm run test:watch # Watch mode
```

**Test Structure:**
```javascript
import { describe, it, expect } from 'vitest'
import { validateMedicine } from '../src/utils/validation'

describe('validateMedicine', () => {
  it('should validate correct medicine data', () => {
    const medicine = {
      name: 'Aspirin',
      dosage: '500mg',
      // ... other fields
    }
    
    const result = validateMedicine(medicine)
    expect(result.valid).toBe(true)
  })
  
  it('should reject invalid medicine data', () => {
    const medicine = {
      name: '', // Invalid: empty name
      dosage: '500mg'
    }
    
    const result = validateMedicine(medicine)
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeDefined()
  })
})
```

### Property-Based Testing

**Framework:** fast-check
**Purpose:** Test properties that should hold for all inputs

**Example:**
```javascript
import fc from 'fast-check'

describe('Medicine validation properties', () => {
  it('should always reject empty medicine names', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.constant(''),
          dosage: fc.string({ minLength: 1 }),
          // ... other fields
        }),
        (medicine) => {
          const result = validateMedicine(medicine)
          expect(result.valid).toBe(false)
        }
      )
    )
  })
})
```

**Test Generators:**
Location: `__tests__/generators/`

Example generators:
- `generatePatient()` - Random valid patient
- `generateMedicine()` - Random valid medicine
- `generateDoseRecord()` - Random valid dose
- `generateInvalidPatient()` - Random invalid patient

### Test Coverage

**Target Coverage:**
- Services: 80%+
- Utilities: 90%+
- Validation: 95%+
- Components: 60%+

**Running Coverage:**
```bash
npm test -- --coverage
```

---

## Browser Support

### Supported Browsers

**Desktop:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

**Mobile:**
- iOS Safari: iOS 13+
- Chrome Android: Last 2 versions
- Samsung Internet: Last 2 versions

### Required Features

- ES2015+ JavaScript
- localStorage API
- Notifications API (optional, for reminders)
- CSS Grid and Flexbox
- CSS Custom Properties
- Fetch API

### Polyfills

**Included:**
- Storage polyfill (window.storage → localStorage)

**Not Needed:**
- Modern browsers support all required features
- Vite handles transpilation for older browsers

---

## Deployment

### Production Build

**Build Command:**
```bash
npm run build
```

**Output:**
- Directory: `dist/`
- Optimized and minified
- Code splitting applied
- Source maps excluded
- Assets hashed for caching

**Build Configuration:**
```javascript
// vite.config.js
{
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'date-vendor': ['date-fns']
        }
      }
    }
  }
}
```

### Deployment Options

#### 1. Static Hosting (Recommended)

**Platforms:**
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

**Steps:**
1. Build the app: `npm run build`
2. Upload `dist/` folder to hosting
3. Configure SPA routing (redirect all to index.html)

**Example (Netlify):**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Docker Container

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

#### 3. Node.js Server

**Using Express:**
```javascript
const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Environment Variables

**Not Required** - App runs entirely client-side

**Optional:**
- `VITE_API_URL` - If adding backend API
- `VITE_APP_VERSION` - App version display

### Post-Deployment Checklist

- ✅ App loads correctly
- ✅ All routes work (SPA routing configured)
- ✅ localStorage works
- ✅ Notifications work (if enabled)
- ✅ Data export/import works
- ✅ Mobile responsive
- ✅ HTTPS enabled (for notifications)
- ✅ Performance optimized (Lighthouse score 90+)

---

## Troubleshooting

### Common Issues

#### 1. Data Not Persisting

**Symptoms:** Data disappears after refresh

**Causes:**
- localStorage disabled in browser
- Private/Incognito mode
- Storage quota exceeded
- Browser extension blocking

**Solutions:**
- Check browser settings → Enable cookies/storage
- Use normal browsing mode
- Clear old data or export/import
- Disable blocking extensions

#### 2. Notifications Not Working

**Symptoms:** No notification alerts

**Causes:**
- Permission not granted
- Notifications disabled in settings
- Browser doesn't support notifications
- HTTPS required (not on localhost)

**Solutions:**
- Settings → Enable notifications → Grant permission
- Check browser notification settings
- Use supported browser (Chrome, Firefox, Safari)
- Deploy with HTTPS for production

#### 3. Doses Not Appearing

**Symptoms:** Schedule shows no doses

**Causes:**
- No medicines added
- Medicine start date in future
- Medicine end date in past
- No timings set for medicine

**Solutions:**
- Add medicines for patient
- Check medicine start/end dates
- Verify medicine has timings configured
- Check patient selection

#### 4. Import Fails

**Symptoms:** Error when importing data

**Causes:**
- Invalid JSON format
- Missing required fields
- Corrupted file
- Wrong file type

**Solutions:**
- Verify JSON is valid (use JSON validator)
- Check file was exported from this app
- Re-export data if corrupted
- Ensure file is .json format

#### 5. Slow Performance

**Symptoms:** App feels sluggish

**Causes:**
- Too much data (thousands of records)
- Old browser
- Low device memory
- Many browser tabs open

**Solutions:**
- Clear old dose records (keep last 3 months)
- Update browser to latest version
- Close unnecessary tabs
- Export data and start fresh

#### 6. Login Not Working

**Symptoms:** Cannot log in with credentials

**Causes:**
- Wrong username/password
- Session expired
- localStorage cleared

**Solutions:**
- Use correct demo credentials (see login page)
- Try logging out and back in
- Clear browser cache and retry

### Debug Mode

**Enable Console Logging:**
Open browser DevTools (F12) → Console tab

**Useful Console Commands:**
```javascript
// Check storage
console.log(localStorage.getItem('medicine-tracker-data'))

// Check auth
console.log(localStorage.getItem('medicine-tracker-auth'))

// Clear all data
localStorage.clear()
location.reload()
```

### Getting Help

**Before Asking:**
1. Check this documentation
2. Check browser console for errors
3. Try in different browser
4. Export data as backup

**When Reporting Issues:**
- Browser and version
- Operating system
- Steps to reproduce
- Error messages (from console)
- Screenshots if applicable

---

## Future Enhancements

### Planned Features

#### 1. Backend Integration
- Cloud data sync across devices
- Multi-user collaboration
- Real-time updates
- Secure authentication

#### 2. Advanced Analytics
- Adherence trends over time
- Medication effectiveness tracking
- Side effect logging
- Health metrics correlation

#### 3. Medication Database
- Drug information lookup
- Dosage recommendations
- Side effects database
- Interaction checker API

#### 4. Enhanced Notifications
- SMS reminders
- Email notifications
- Phone call reminders
- Caregiver alerts

#### 5. Reporting
- PDF reports generation
- Doctor visit summaries
- Insurance claim reports
- Adherence certificates

#### 6. Integration
- Pharmacy integration
- Doctor portal access
- Health insurance integration
- Wearable device sync

#### 7. Accessibility
- Voice commands
- Screen reader optimization
- High contrast mode
- Large text mode

#### 8. Localization
- Multiple languages
- Date/time format localization
- Currency localization
- Regional drug databases

#### 9. Mobile Apps
- Native iOS app
- Native Android app
- Offline-first architecture
- Push notifications

#### 10. AI Features
- Medication schedule optimization
- Interaction prediction
- Adherence prediction
- Personalized reminders

---

## Contributing

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/my-feature`
5. Make changes
6. Run tests: `npm test`
7. Commit changes: `git commit -m "Add my feature"`
8. Push to branch: `git push origin feature/my-feature`
9. Create Pull Request

### Code Style

- Use ESLint configuration
- Follow existing code patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Guidelines

- Describe what the PR does
- Reference related issues
- Include screenshots for UI changes
- Ensure tests pass
- Update README if needed

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **date-fns** - For excellent date utilities
- **Vite** - For the fast build tool
- **Healthcare Community** - For inspiration and feedback

---

## Contact & Support

**Documentation:** This file
**Issues:** GitHub Issues (if applicable)
**Email:** [Your contact email]

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Author:** Medicine Tracker Team

---

## Quick Reference

### Common Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Demo Credentials
```
Administrator:  admin / admin123
Caregiver:      caregiver / care123
Family Member:  family / family123
```

### Important URLs
```
Development:  http://localhost:5173
Production:   [Your deployment URL]
```

### Key Files
```
src/App.jsx                    - Root component
src/contexts/AppProviders.jsx  - State management
src/services/StorageService.js - Data persistence
src/utils/validation.js        - Data validation
tailwind.config.js             - Design system
vite.config.js                 - Build configuration
```

---

**Thank you for using Medicine Tracker! 💊**

*Helping caregivers provide better care, one dose at a time.*
