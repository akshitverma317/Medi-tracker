# Design Document

## Overview

The Medicine Tracker Application is a single-page React application that provides comprehensive medication management for multiple patients. The architecture follows a component-based design with centralized state management using React Context API, persistent storage via window.storage API, and a mobile-first responsive UI built with Tailwind CSS.

The application prioritizes user experience for elderly users and busy caregivers through large touch targets, clear typography, intuitive navigation, and minimal-click workflows. The system operates entirely client-side with no external dependencies for core functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Components)                       │
│  ├─ Pages (Dashboard, AddMedicine, Patients, etc.)          │
│  ├─ Shared Components (Buttons, Forms, Cards)               │
│  └─ Layout Components (Navigation, Header)                   │
├─────────────────────────────────────────────────────────────┤
│  State Management Layer (React Context)                      │
│  ├─ MedicineContext (medicine CRUD operations)              │
│  ├─ PatientContext (patient management)                     │
│  ├─ ScheduleContext (dose tracking, reminders)              │
│  └─ StorageContext (persistence operations)                 │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                        │
│  ├─ Medicine Service (validation, calculations)             │
│  ├─ Schedule Service (dose generation, status)              │
│  ├─ Inventory Service (stock tracking, refill calc)         │
│  └─ Notification Service (reminder logic)                   │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                           │
│  ├─ Storage Service (window.storage wrapper)                │
│  └─ Data Models (TypeScript interfaces)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  window.storage API
```

### Technology Stack

- **Framework**: React 18+ with React Router v6
- **Styling**: Tailwind CSS 3+
- **State Management**: React Context API with useReducer
- **Storage**: window.storage API (with fallback handling)
- **Build Tool**: Vite (for fast development and optimized builds)
- **Type Safety**: TypeScript (optional but recommended)
- **Date Handling**: date-fns (lightweight date utilities)

### Routing Structure

```
/ (Dashboard - Today's Schedule)
/add-medicine (Add/Edit Medicine Form)
/patients (Patient Management)
/patient/:id (Patient Detail View)
/calendar (Weekly/Monthly Calendar View)
/inventory (Stock Levels and Refills)
/history (Medication History Log)
/settings (App Preferences and Data Management)
```

## Components and Interfaces

### Core Data Models

```typescript
interface Patient {
  id: string;
  name: string;
  age: number;
  photo?: string;
  medicalConditions: string[];
  allergies: string[];
  caregiverName: string;
  createdAt: string;
  updatedAt: string;
}

interface Medicine {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: 'once-daily' | 'twice-daily' | 'three-times-daily' | 'four-times-daily' | 'as-needed' | 'custom';
  timings: string[]; // Array of time strings like ["08:00", "20:00"]
  category: 'pills' | 'liquid' | 'injection' | 'inhaler' | 'other';
  notes?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  reminderMinutesBefore: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface DoseRecord {
  id: string;
  medicineId: string;
  patientId: string;
  scheduledTime: string; // ISO datetime
  status: 'upcoming' | 'taken' | 'missed' | 'overdue';
  actualTime?: string; // ISO datetime when marked
  notes?: string;
}

interface RefillRecord {
  id: string;
  medicineId: string;
  date: string;
  quantityAdded: number;
  notes?: string;
}

interface AppState {
  patients: Patient[];
  medicines: Medicine[];
  doseRecords: DoseRecord[];
  refillRecords: RefillRecord[];
  settings: AppSettings;
}

interface AppSettings {
  defaultReminderMinutes: number;
  defaultLowStockThreshold: number;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}
```

### Context Providers

**StorageContext**: Manages all data persistence operations
- Methods: `saveData()`, `loadData()`, `exportData()`, `importData()`
- Handles window.storage API interactions and error recovery

**PatientContext**: Manages patient profiles
- Methods: `addPatient()`, `updatePatient()`, `deletePatient()`, `getPatient(id)`
- State: `patients[]`, `selectedPatientId`

**MedicineContext**: Manages medicine records
- Methods: `addMedicine()`, `updateMedicine()`, `deleteMedicine()`, `getMedicinesByPatient(patientId)`
- State: `medicines[]`

**ScheduleContext**: Manages dose scheduling and tracking
- Methods: `generateDoses()`, `markDoseTaken()`, `markDoseMissed()`, `getDosesForDate(date)`
- State: `doseRecords[]`, `upcomingReminders[]`

**InventoryContext**: Manages stock and refills
- Methods: `updateStock()`, `addRefill()`, `calculateRefillDate()`, `getLowStockMedicines()`
- State: `refillRecords[]`, `lowStockAlerts[]`

### Key Components

**Page Components:**
- `Dashboard`: Today's schedule with quick actions
- `AddMedicinePage`: Comprehensive medicine form
- `PatientListPage`: Patient management interface
- `PatientDetailPage`: Individual patient view with medicines
- `CalendarPage`: Week/month view with dose visualization
- `InventoryPage`: Stock levels and refill tracking
- `HistoryPage`: Filterable dose history log
- `SettingsPage`: App preferences and data management

**Shared Components:**
- `MedicineCard`: Display medicine information
- `DoseItem`: Individual dose with status and actions
- `PatientCard`: Patient profile summary
- `StatusBadge`: Color-coded status indicator
- `EmptyState`: Helpful message when no data exists
- `LoadingSpinner`: Loading indicator
- `ConfirmDialog`: Confirmation for destructive actions
- `UndoToast`: Undo notification for recent actions
- `SearchBar`: Search and filter interface
- `DatePicker`: Date selection component
- `TimePicker`: Time selection component

**Layout Components:**
- `AppLayout`: Main layout wrapper with navigation
- `BottomTabBar`: Mobile navigation (Dashboard, Patients, Calendar, More)
- `Header`: Page title and actions
- `Sidebar`: Desktop navigation

## Data Models

### Storage Schema

All data is stored in window.storage under a single key: `medicine-tracker-data`

```json
{
  "version": "1.0.0",
  "lastModified": "2024-01-15T10:30:00Z",
  "patients": [...],
  "medicines": [...],
  "doseRecords": [...],
  "refillRecords": [...],
  "settings": {...}
}
```

### Data Relationships

- Patient (1) → (N) Medicines
- Medicine (1) → (N) DoseRecords
- Medicine (1) → (N) RefillRecords
- DoseRecord references both Medicine and Patient for efficient querying

### Data Validation Rules

**Patient Validation:**
- Name: Required, 1-100 characters
- Age: Required, 0-150
- Caregiver name: Required, 1-100 characters

**Medicine Validation:**
- Name: Required, 1-200 characters
- Dosage: Required, 1-100 characters
- Frequency: Required, must be valid enum value
- Timings: Required, at least one valid time (HH:MM format)
- Category: Required, must be valid enum value
- Stock quantity: Required, >= 0
- Low stock threshold: Required, >= 0
- Reminder minutes: Required, >= 0

**Dose Record Validation:**
- Medicine ID: Must reference existing medicine
- Patient ID: Must reference existing patient
- Scheduled time: Required, valid ISO datetime
- Status: Required, must be valid enum value

## Cor
rectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Medicine creation completeness
*For any* valid medicine data with all required fields (name, dosage, frequency, timing, category), adding the medicine should result in a stored medicine record containing all specified fields.
**Validates: Requirements 1.1**

### Property 2: Medicine update preserves identity
*For any* existing medicine, updating its fields should preserve the medicine ID and creation timestamp while updating the modification timestamp.
**Validates: Requirements 1.2**

### Property 3: Medicine deletion cascades to doses
*For any* medicine with associated dose records, deleting the medicine should remove both the medicine and all its dose records from the system.
**Validates: Requirements 1.3**

### Property 4: Patient-medicine assignment creates link
*For any* patient and medicine, assigning the medicine to the patient should result in the medicine's patientId matching the patient's ID.
**Validates: Requirements 1.4**

### Property 5: Medicine category validation
*For any* medicine, the category field should only accept values from the set: pills, liquid, injection, inhaler, or other.
**Validates: Requirements 1.5**

### Property 6: Daily schedule chronological ordering
*For any* set of doses on a given date, retrieving the daily schedule should return doses sorted by scheduled time in ascending order.
**Validates: Requirements 2.1**

### Property 7: Marking dose as taken updates state
*For any* dose, marking it as taken should set the status to "taken" and record a timestamp within 1 second of the current time.
**Validates: Requirements 2.2**

### Property 8: Marking dose as missed updates state
*For any* dose, marking it as missed should set the status to "missed" and record a timestamp within 1 second of the current time.
**Validates: Requirements 2.3**

### Property 9: Overdue status automatic assignment
*For any* dose with status "upcoming", if the current time exceeds the scheduled time by more than 30 minutes, the status should be "overdue".
**Validates: Requirements 2.4**

### Property 10: Dose status color distinctness
*For any* dose status (upcoming, taken, missed, overdue), the color code assigned should be unique and different from all other status colors.
**Validates: Requirements 2.5**

### Property 11: Weekly view date filtering
*For any* set of doses, filtering by weekly view should return only doses with scheduled dates within the current week (Monday to Sunday).
**Validates: Requirements 3.1**

### Property 12: Monthly view date filtering
*For any* set of doses, filtering by monthly view should return only doses with scheduled dates within the current month.
**Validates: Requirements 3.2**

### Property 13: Specific date filtering
*For any* date and set of doses, filtering by that specific date should return only doses scheduled for that exact date.
**Validates: Requirements 3.3**

### Property 14: Reminder timing calculation
*For any* dose with a configured reminder time, the reminder should be triggered at exactly (scheduled time - reminder minutes) before the dose.
**Validates: Requirements 4.1**

### Property 15: Reminder content completeness
*For any* dose reminder, the notification should contain the patient name, medicine name, dosage, and scheduled time.
**Validates: Requirements 4.2**

### Property 16: Reminder preference persistence
*For any* reminder timing preference, setting it and then retrieving it should return the same value, and future reminders should use this value.
**Validates: Requirements 4.3**

### Property 17: Stock quantity persistence
*For any* medicine, setting a stock quantity and then retrieving the medicine should return the same stock quantity value.
**Validates: Requirements 5.1**

### Property 18: Dose taken decrements stock
*For any* medicine with stock quantity N, marking a dose as taken should result in stock quantity N-1.
**Validates: Requirements 5.2**

### Property 19: Low stock alert triggering
*For any* medicine, if stock quantity < low stock threshold, a low stock alert should be present; if stock quantity >= threshold, no alert should be present.
**Validates: Requirements 5.3**

### Property 20: Refill date calculation accuracy
*For any* medicine with stock quantity S and daily consumption rate R, the calculated refill date should be today + (S / R) days.
**Validates: Requirements 5.4**

### Property 21: Refill recording updates stock
*For any* medicine with stock quantity S, recording a refill of quantity Q should result in stock quantity S+Q and a refill record with the correct date and quantity.
**Validates: Requirements 5.5**

### Property 22: Patient creation completeness
*For any* valid patient data with all required fields (name, age, caregiver name), creating a patient should result in a stored patient record containing all specified fields including medical conditions and allergies arrays.
**Validates: Requirements 6.1**

### Property 23: Patient switching filters medicines
*For any* two patients with different medicine assignments, switching from patient A to patient B should display only medicines where patientId equals patient B's ID.
**Validates: Requirements 6.2**

### Property 24: Patient profile shows all medicines
*For any* patient with N assigned medicines, viewing the patient profile should display all N medicines.
**Validates: Requirements 6.3**

### Property 25: Patient deletion cascades
*For any* patient with assigned medicines, deleting the patient should remove the patient record and all medicine assignments (medicines with that patientId).
**Validates: Requirements 6.5**

### Property 26: Data serialization round-trip
*For any* application state, serializing to JSON and then deserializing should produce an equivalent state with all data intact.
**Validates: Requirements 7.2, 7.3**

### Property 27: Storage error graceful handling
*For any* storage operation that fails, the application should catch the error, continue operating with in-memory data, and display an error notification to the user.
**Validates: Requirements 7.5**

### Property 28: Export data completeness
*For any* application state with patients, medicines, doses, and refills, exporting should produce a JSON file containing all entities.
**Validates: Requirements 8.1**

### Property 29: Import validation rejects invalid data
*For any* JSON data that doesn't match the expected schema, importing should reject the data and return specific validation errors.
**Validates: Requirements 8.2**

### Property 30: Valid import succeeds
*For any* valid JSON data matching the schema, importing should successfully load the data into the application state.
**Validates: Requirements 8.4**

### Property 31: Search filters by name
*For any* search query string Q and set of medicines, the filtered results should only include medicines where the name contains Q (case-insensitive).
**Validates: Requirements 9.1**

### Property 32: Patient filter shows only patient medicines
*For any* patient ID and set of medicines, filtering by that patient should return only medicines where patientId equals the selected patient ID.
**Validates: Requirements 9.2**

### Property 33: Sort order correctness
*For any* set of medicines and sort option (by time, by patient, alphabetically), the returned list should be ordered according to the selected criterion.
**Validates: Requirements 9.3**

### Property 34: Responsive layout adaptation
*For any* viewport width (mobile: <768px, tablet: 768-1024px, desktop: >1024px), the layout should adapt with appropriate component arrangements for that screen size.
**Validates: Requirements 10.1**

### Property 35: Minimum font size compliance
*For any* text element in the application, the computed font size should be at least 16 pixels.
**Validates: Requirements 10.3**

### Property 36: Touch target size compliance
*For any* interactive element (button, link, input), the touch target dimensions should be at least 44x44 pixels.
**Validates: Requirements 10.4**

### Property 37: Empty state display
*For any* data collection (patients, medicines, doses) that is empty, the UI should display an empty state message with helpful text.
**Validates: Requirements 10.5**

### Property 38: Undo functionality timing
*For any* delete operation, an undo action should be available for 10 seconds after the deletion, and invoking undo should restore the deleted data.
**Validates: Requirements 11.4**

### Property 39: Form validation error display
*For any* form submission with invalid fields, the form should display specific error messages for each invalid field and prevent submission.
**Validates: Requirements 12.1**

### Property 40: Inline validation feedback
*For any* form field with validation rules, entering invalid data should trigger inline validation feedback without requiring form submission.
**Validates: Requirements 12.2**

### Property 41: Required field validation
*For any* form with required fields, attempting to submit with empty required fields should prevent submission and highlight the empty fields.
**Validates: Requirements 12.3**

### Property 42: Loading indicator display
*For any* asynchronous operation (save, load, delete), a loading indicator should be visible while the operation is in progress.
**Validates: Requirements 12.4**

### Property 43: Error message display on failure
*For any* operation that fails, an error message should be displayed explaining the failure reason.
**Validates: Requirements 12.5**

### Property 44: History completeness
*For any* set of dose records with status "taken" or "missed", viewing the history should display all such records with their timestamps.
**Validates: Requirements 13.1**

### Property 45: History date range filtering
*For any* date range [start, end] and set of dose records, filtering history by that range should return only records with timestamps between start and end (inclusive).
**Validates: Requirements 13.2**

### Property 46: History patient filtering
*For any* patient ID and set of dose records, filtering history by that patient should return only records where patientId equals the selected patient ID.
**Validates: Requirements 13.3**

### Property 47: History entry completeness
*For any* dose record in history, the displayed entry should include patient name, medicine name, scheduled time, actual time (if taken), and status.
**Validates: Requirements 13.4**

## Error Handling

### Storage Errors

**window.storage API Unavailable:**
- Detect availability on application initialization
- Display prominent warning banner: "Storage unavailable - data will not persist"
- Continue operation in memory-only mode
- Disable export/import features
- Show warning before user closes browser

**Storage Quota Exceeded:**
- Catch QuotaExceededError during save operations
- Display error: "Storage full - please export data and clear old records"
- Offer immediate export option
- Prevent new data creation until space is available

**Storage Read/Write Failures:**
- Wrap all storage operations in try-catch blocks
- Log errors to console for debugging
- Display user-friendly error messages
- Maintain in-memory state as fallback
- Retry failed operations with exponential backoff (max 3 attempts)

### Data Validation Errors

**Invalid Medicine Data:**
- Validate all required fields before saving
- Show field-specific error messages
- Prevent form submission until valid
- Highlight invalid fields with red borders
- Display validation rules near fields

**Invalid Patient Data:**
- Similar validation approach as medicines
- Age validation: 0-150 range
- Name validation: non-empty, max 100 characters

**Invalid Import Data:**
- Validate JSON structure before parsing
- Check for required fields in each entity
- Validate data types and formats
- Display specific validation errors
- Reject entire import if any entity is invalid
- Offer option to download error report

### User Input Errors

**Empty Required Fields:**
- Prevent form submission
- Highlight empty fields
- Show "This field is required" message
- Focus first invalid field

**Invalid Time Format:**
- Validate HH:MM format (00:00 to 23:59)
- Show format hint below input
- Provide time picker as alternative

**Invalid Date Selections:**
- Prevent selection of past dates for new medicines
- Validate end date is after start date
- Show clear error messages

### Network and System Errors

**Date/Time System Errors:**
- Handle invalid Date objects gracefully
- Fall back to current date/time if parsing fails
- Display "Invalid date" in UI rather than crashing

**Component Rendering Errors:**
- Implement Error Boundaries around major sections
- Display fallback UI: "Something went wrong - please refresh"
- Log error details to console
- Provide "Report Issue" button

## Testing Strategy

### Unit Testing

The application will use **Vitest** as the testing framework for unit tests. Unit tests will focus on:

**Service Layer Tests:**
- Medicine validation functions
- Schedule generation logic
- Stock calculation functions
- Date/time utilities
- Data transformation functions

**Component Tests:**
- Form validation behavior
- Button click handlers
- Conditional rendering logic
- Props handling

**Example Unit Tests:**
- Test that `calculateRefillDate(stock: 10, dailyRate: 2)` returns date 5 days from now
- Test that `validateMedicine()` rejects empty medicine names
- Test that `generateDosesForDay()` creates correct number of doses for a medicine
- Test that StatusBadge component renders correct color for each status
- Test that empty state components display when data arrays are empty

### Property-Based Testing

The application will use **fast-check** (for JavaScript/TypeScript) as the property-based testing library. Property-based tests will verify universal properties across many randomly generated inputs.

**Configuration:**
- Each property test will run a minimum of 100 iterations
- Tests will use custom generators for domain objects (Patient, Medicine, DoseRecord)
- Each test will be tagged with a comment referencing the design document property

**Property Test Implementation:**
- Each correctness property from this design document will be implemented as a single property-based test
- Tests will be tagged using format: `// Feature: medicine-tracker-app, Property N: [property text]`
- Tests will be placed in `__tests__/properties/` directory
- Generators will be defined in `__tests__/generators/` directory

**Example Property Tests:**
- Property 18: Generate random medicine with stock N, mark dose taken, verify stock is N-1
- Property 6: Generate random array of doses, verify getDailySchedule() returns them sorted by time
- Property 26: Generate random app state, serialize to JSON, deserialize, verify equality
- Property 31: Generate random medicines and search query, verify all results contain query string

**Test Generators:**
- `arbitraryPatient()`: Generates valid patient objects with random data
- `arbitraryMedicine()`: Generates valid medicine objects with random data
- `arbitraryDoseRecord()`: Generates valid dose records
- `arbitraryAppState()`: Generates complete application state
- `arbitraryTimeString()`: Generates valid HH:MM time strings
- `arbitraryDateString()`: Generates valid ISO date strings

### Integration Testing

Integration tests will verify interactions between multiple components and contexts:

- Patient creation → Medicine assignment → Dose generation flow
- Medicine deletion → Dose cascade deletion
- Stock update → Low stock alert triggering
- Data export → Import → Verification of data integrity
- Form submission → Validation → Storage → Retrieval

### End-to-End User Flows

While not automated, the following user flows should be manually tested:

- Complete patient onboarding: Create patient → Add medicines → View schedule
- Daily caregiver workflow: View dashboard → Mark doses taken → Check inventory
- Refill workflow: Receive low stock alert → Record refill → Verify alert clears
- Data management: Export data → Clear app → Import data → Verify restoration

## Performance Considerations

### Data Loading

- Lazy load dose records (only load current week by default)
- Implement virtual scrolling for long medicine lists (>50 items)
- Debounce search input (300ms delay)
- Memoize expensive calculations (refill dates, dose generation)

### Storage Optimization

- Compress JSON before storing (if size > 1MB)
- Implement data pruning: archive dose records older than 6 months
- Limit history to last 1000 records by default
- Provide manual "Clear Old Data" option in settings

### Rendering Optimization

- Use React.memo for expensive components (MedicineCard, DoseItem)
- Implement code splitting by route
- Lazy load calendar view (heavy component)
- Use CSS transforms for animations (better performance)
- Optimize images: max 200KB, lazy load patient photos

### Mobile Performance

- Minimize bundle size: target <500KB initial load
- Use system fonts to avoid font loading delay
- Implement service worker for offline capability (future enhancement)
- Reduce animation complexity on low-end devices

## Security Considerations

### Data Privacy

- All data stored locally in browser (no server transmission)
- No analytics or tracking
- No external API calls
- Clear data export/import for user control

### Input Sanitization

- Sanitize all user inputs before rendering (prevent XSS)
- Validate all data types before storage
- Escape special characters in search queries
- Limit input lengths to prevent storage abuse

### Access Control

- No authentication required (single-user local app)
- Consider adding optional PIN protection (future enhancement)
- Warn users about shared device access

## Accessibility

### WCAG 2.1 AA Compliance

- Minimum contrast ratio 4.5:1 for normal text
- Minimum contrast ratio 3:1 for large text and UI components
- All interactive elements keyboard accessible
- Logical tab order throughout application
- Skip navigation links for keyboard users

### Screen Reader Support

- Semantic HTML elements (nav, main, article, section)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content (notifications, alerts)
- Descriptive alt text for images
- Form labels properly associated with inputs

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals/dialogs
- Arrow keys for date/time pickers
- Focus indicators visible and clear (2px outline)

### Visual Accessibility

- Support for browser zoom up to 200%
- No information conveyed by color alone
- Clear focus indicators
- Sufficient spacing between interactive elements
- Support for reduced motion preferences

## Deployment and Build

### Build Configuration

```javascript
// vite.config.js
export default {
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
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

### Browser Support

- Chrome/Edge: last 2 versions
- Firefox: last 2 versions
- Safari: last 2 versions
- Mobile Safari: iOS 13+
- Chrome Android: last 2 versions

### Progressive Enhancement

- Core functionality works without JavaScript (static HTML fallback)
- Graceful degradation if window.storage unavailable
- Works offline after initial load (future: service worker)

## Future Enhancements

### Phase 2 Features (Not in Current Scope)

- Multi-device sync via cloud storage
- Medication interaction warnings
- Photo capture for medicine identification
- Barcode scanning for medicine entry
- Prescription refill reminders with pharmacy integration
- Caregiver collaboration (multiple users per patient)
- Health metrics tracking (blood pressure, glucose)
- Doctor appointment scheduling
- Medication adherence reports (PDF export)
- Voice commands for hands-free operation
- Dark mode theme
- Multiple language support
- Push notifications (requires service worker)

### Technical Debt to Address

- Migrate to TypeScript for better type safety
- Implement comprehensive E2E test suite with Playwright
- Add performance monitoring
- Implement proper logging system
- Add error reporting service integration
- Optimize bundle size further
- Implement proper state machine for dose status transitions
