# Implementation Plan

- [x] 1. Project setup and configuration
  - Initialize React project with Vite
  - Install dependencies: React Router, Tailwind CSS, date-fns, fast-check
  - Configure Tailwind with healthcare color palette
  - Set up project directory structure (components, contexts, services, utils, types)
  - Create base TypeScript interfaces for data models
  - _Requirements: All_

- [x] 2. Implement data models and storage service
  - [x] 2.1 Create TypeScript interfaces for Patient, Medicine, DoseRecord, RefillRecord, AppState, AppSettings
    - Define all data model interfaces with proper types
    - Add JSDoc comments for clarity
    - _Requirements: 1.1, 6.1, 5.5, 7.2_

  - [x] 2.2 Implement StorageService with window.storage API wrapper
    - Create saveData(), loadData(), exportData(), importData() methods
    - Add error handling for storage unavailability
    - Implement JSON serialization/deserialization
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 2.3 Write property test for data serialization round-trip
    - **Property 26: Data serialization round-trip**
    - **Validates: Requirements 7.2, 7.3**

  - [ ]* 2.4 Write property test for storage error handling
    - **Property 27: Storage error graceful handling**
    - **Validates: Requirements 7.5**

- [x] 3. Implement validation utilities
  - [x] 3.1 Create validation functions for medicine data
    - Implement validateMedicine() with all field validations
    - Implement validateTimeFormat() for HH:MM validation
    - Add error message generation
    - _Requirements: 1.1, 12.1, 12.2_

  - [x] 3.2 Create validation functions for patient data
    - Implement validatePatient() with field validations
    - Validate age range (0-150)
    - Validate required fields
    - _Requirements: 6.1, 12.1_

  - [ ]* 3.3 Write property test for medicine category validation
    - **Property 5: Medicine category validation**
    - **Validates: Requirements 1.5**

  - [ ]* 3.4 Write property test for form validation error display
    - **Property 39: Form validation error display**
    - **Validates: Requirements 12.1**

- [x] 4. Create Context providers for state management
  - [x] 4.1 Implement StorageContext
    - Create context with storage operations
    - Implement useStorage hook
    - Handle initialization and error states
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 4.2 Implement PatientContext
    - Create context with patient CRUD operations
    - Implement addPatient(), updatePatient(), deletePatient(), getPatient()
    - Add selectedPatientId state
    - _Requirements: 6.1, 6.2, 6.5_

  - [x] 4.3 Implement MedicineContext
    - Create context with medicine CRUD operations
    - Implement addMedicine(), updateMedicine(), deleteMedicine()
    - Implement getMedicinesByPatient()
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 4.4 Implement ScheduleContext
    - Create context for dose tracking
    - Implement generateDoses(), markDoseTaken(), markDoseMissed()
    - Implement getDosesForDate(), getDailySchedule()
    - Add automatic overdue status checking
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.5 Implement InventoryContext
    - Create context for stock management
    - Implement updateStock(), addRefill(), calculateRefillDate()
    - Implement getLowStockMedicines()
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 4.6 Write property test for medicine creation completeness
    - **Property 1: Medicine creation completeness**
    - **Validates: Requirements 1.1**

  - [ ]* 4.7 Write property test for medicine deletion cascade
    - **Property 3: Medicine deletion cascades to doses**
    - **Validates: Requirements 1.3**

  - [ ]* 4.8 Write property test for patient-medicine assignment
    - **Property 4: Patient-medicine assignment creates link**
    - **Validates: Requirements 1.4**

  - [ ]* 4.9 Write property test for dose taken updates state
    - **Property 7: Marking dose as taken updates state**
    - **Validates: Requirements 2.2**

  - [ ]* 4.10 Write property test for stock decrement on dose taken
    - **Property 18: Dose taken decrements stock**
    - **Validates: Requirements 5.2**

- [x] 5. Implement business logic services
  - [x] 5.1 Create ScheduleService
    - Implement dose generation logic based on frequency
    - Implement status calculation (upcoming, overdue)
    - Implement chronological sorting
    - _Requirements: 2.1, 2.4_

  - [x] 5.2 Create InventoryService
    - Implement refill date calculation
    - Implement low stock detection
    - Implement stock update logic
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 5.3 Create NotificationService
    - Implement reminder timing calculation
    - Implement in-app notification display logic
    - _Requirements: 4.1, 4.2_

  - [ ]* 5.4 Write property test for daily schedule chronological ordering
    - **Property 6: Daily schedule chronological ordering**
    - **Validates: Requirements 2.1**

  - [ ]* 5.5 Write property test for overdue status assignment
    - **Property 9: Overdue status automatic assignment**
    - **Validates: Requirements 2.4**

  - [ ]* 5.6 Write property test for refill date calculation
    - **Property 20: Refill date calculation accuracy**
    - **Validates: Requirements 5.4**

  - [ ]* 5.7 Write property test for low stock alert triggering
    - **Property 19: Low stock alert triggering**
    - **Validates: Requirements 5.3**

- [x] 6. Create shared UI components
  - [x] 6.1 Implement base components (Button, Input, Card, Badge)
    - Create Button with variants and sizes (min 44x44px touch targets)
    - Create Input with validation states
    - Create Card component for content containers
    - Create StatusBadge with color coding
    - _Requirements: 10.4, 2.5_

  - [x] 6.2 Implement form components (FormField, Select, TimePicker, DatePicker)
    - Create FormField with label and error display
    - Create Select dropdown component
    - Create TimePicker for HH:MM input
    - Create DatePicker for date selection
    - _Requirements: 12.1, 12.2_

  - [x] 6.3 Implement feedback components (LoadingSpinner, EmptyState, ErrorMessage)
    - Create LoadingSpinner component
    - Create EmptyState with illustrations and helpful text
    - Create ErrorMessage component
    - _Requirements: 10.5, 12.4, 12.5_

  - [x] 6.4 Implement dialog components (ConfirmDialog, UndoToast)
    - Create ConfirmDialog for destructive actions
    - Create UndoToast with 10-second timer
    - _Requirements: 11.4_

  - [ ]* 6.5 Write property test for dose status color distinctness
    - **Property 10: Dose status color distinctness**
    - **Validates: Requirements 2.5**

  - [ ]* 6.6 Write property test for touch target size compliance
    - **Property 36: Touch target size compliance**
    - **Validates: Requirements 10.4**

  - [ ]* 6.7 Write property test for minimum font size compliance
    - **Property 35: Minimum font size compliance**
    - **Validates: Requirements 10.3**

- [x] 7. Implement layout components
  - [x] 7.1 Create AppLayout with responsive navigation
    - Implement main layout wrapper
    - Add responsive breakpoints (mobile, tablet, desktop)
    - _Requirements: 10.1_

  - [x] 7.2 Create BottomTabBar for mobile navigation
    - Implement tab bar with Dashboard, Patients, Calendar, More tabs
    - Add active state indicators
    - Show only on mobile viewports (<768px)
    - _Requirements: 10.2_

  - [x] 7.3 Create Header component
    - Implement page title display
    - Add action buttons area
    - _Requirements: 10.1_

  - [x] 7.4 Create Sidebar for desktop navigation
    - Implement sidebar with navigation links
    - Show only on desktop viewports (>1024px)
    - _Requirements: 10.1_

  - [ ]* 7.5 Write property test for responsive layout adaptation
    - **Property 34: Responsive layout adaptation**
    - **Validates: Requirements 10.1**

- [x] 8. Implement Dashboard page
  - [x] 8.1 Create Dashboard component
    - Display today's date prominently
    - Show today's doses grouped by time
    - Implement quick mark-as-taken functionality
    - Display low stock alerts
    - _Requirements: 2.1, 11.2, 11.3_

  - [x] 8.2 Create DoseItem component
    - Display patient name, medicine name, dosage, time
    - Show status badge with color coding
    - Add single-tap mark-as-taken button
    - _Requirements: 2.5, 11.3_

  - [x] 8.3 Add empty state for no doses today
    - Display helpful message when no doses scheduled
    - Show illustration or icon
    - _Requirements: 10.5_

  - [ ]* 8.4 Write property test for empty state display
    - **Property 37: Empty state display**
    - **Validates: Requirements 10.5**

- [x] 9. Implement Patient Management pages
  - [x] 9.1 Create PatientListPage
    - Display all patients as cards
    - Show patient name, age, medicine count
    - Add "Add Patient" button
    - Implement patient selection for switching
    - _Requirements: 6.2, 6.3_

  - [x] 9.2 Create PatientDetailPage
    - Display patient information (name, age, conditions, allergies, caregiver)
    - Show all assigned medicines
    - Add edit and delete buttons
    - _Requirements: 6.3, 6.4_

  - [x] 9.3 Create AddEditPatientForm
    - Implement form with all patient fields
    - Add inline validation
    - Handle create and update modes
    - _Requirements: 6.1, 12.2_

  - [ ]* 9.4 Write property test for patient creation completeness
    - **Property 22: Patient creation completeness**
    - **Validates: Requirements 6.1**

  - [ ]* 9.5 Write property test for patient switching filters medicines
    - **Property 23: Patient switching filters medicines**
    - **Validates: Requirements 6.2**

  - [ ]* 9.6 Write property test for patient deletion cascade
    - **Property 25: Patient deletion cascades**
    - **Validates: Requirements 6.5**

- [x] 10. Implement Medicine Management pages
  - [x] 10.1 Create AddMedicinePage
    - Implement comprehensive medicine form
    - Add fields: name, dosage, frequency, timings, category, notes
    - Add stock quantity and threshold fields
    - Add reminder timing field
    - Implement patient selection
    - _Requirements: 1.1, 5.1_

  - [x] 10.2 Implement quick-add medicine feature
    - Create simplified form with only required fields
    - Add to Dashboard as floating action button
    - _Requirements: 11.1_

  - [x] 10.3 Add medicine form validation
    - Validate all required fields
    - Validate time format (HH:MM)
    - Show inline error messages
    - Prevent submission with invalid data
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 10.4 Write property test for medicine update preserves identity
    - **Property 2: Medicine update preserves identity**
    - **Validates: Requirements 1.2**

  - [ ]* 10.5 Write property test for required field validation
    - **Property 41: Required field validation**
    - **Validates: Requirements 12.3**

- [x] 11. Implement Calendar View page
  - [x] 11.1 Create CalendarPage with view toggle
    - Add weekly/monthly view selector
    - Implement date navigation (prev/next)
    - _Requirements: 3.1, 3.2_

  - [x] 11.2 Create WeekView component
    - Display 7 days with doses
    - Group doses by day
    - Show status indicators
    - _Requirements: 3.1, 3.4_

  - [x] 11.3 Create MonthView component
    - Display calendar grid for current month
    - Show dose count per day
    - Add click to view day details
    - _Requirements: 3.2, 3.4_

  - [ ]* 11.4 Write property test for weekly view date filtering
    - **Property 11: Weekly view date filtering**
    - **Validates: Requirements 3.1**

  - [ ]* 11.5 Write property test for monthly view date filtering
    - **Property 12: Monthly view date filtering**
    - **Validates: Requirements 3.2**

  - [ ]* 11.6 Write property test for specific date filtering
    - **Property 13: Specific date filtering**
    - **Validates: Requirements 3.3**

- [x] 12. Implement Inventory page
  - [x] 12.1 Create InventoryPage
    - Display all medicines with stock levels
    - Show low stock alerts prominently
    - Display calculated refill dates
    - Add "Record Refill" button per medicine
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 12.2 Create RefillDialog
    - Implement form to record refill
    - Add quantity input
    - Add optional notes field
    - Update stock on submission
    - _Requirements: 5.5_

  - [x] 12.3 Display refill history per medicine
    - Show past refills with dates and quantities
    - _Requirements: 5.5_

  - [ ]* 12.4 Write property test for refill recording updates stock
    - **Property 21: Refill recording updates stock**
    - **Validates: Requirements 5.5**

- [x] 13. Implement History page
  - [x] 13.1 Create HistoryPage
    - Display all taken and missed doses
    - Show patient name, medicine name, times, status
    - Implement date range filter
    - Implement patient filter
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 13.2 Create filter controls
    - Add date range picker
    - Add patient dropdown filter
    - Add status filter (taken/missed)
    - _Requirements: 13.2, 13.3_

  - [ ]* 13.3 Write property test for history completeness
    - **Property 44: History completeness**
    - **Validates: Requirements 13.1**

  - [ ]* 13.4 Write property test for history date range filtering
    - **Property 45: History date range filtering**
    - **Validates: Requirements 13.2**

  - [ ]* 13.5 Write property test for history patient filtering
    - **Property 46: History patient filtering**
    - **Validates: Requirements 13.3**

  - [ ]* 13.6 Write property test for history entry completeness
    - **Property 47: History entry completeness**
    - **Validates: Requirements 13.4**

- [ ] 14. Implement Search and Filter functionality
  - [ ] 14.1 Create SearchBar component
    - Implement text input with debounce (300ms)
    - Add clear button
    - _Requirements: 9.1_

  - [ ] 14.2 Implement search logic in MedicineContext
    - Filter medicines by name (case-insensitive)
    - Update results immediately on query change
    - _Requirements: 9.1, 9.4_

  - [ ] 14.3 Implement filter and sort controls
    - Add patient filter dropdown
    - Add sort options (by time, by patient, alphabetically)
    - _Requirements: 9.2, 9.3_

  - [ ]* 14.4 Write property test for search filters by name
    - **Property 31: Search filters by name**
    - **Validates: Requirements 9.1**

  - [ ]* 14.5 Write property test for patient filter
    - **Property 32: Patient filter shows only patient medicines**
    - **Validates: Requirements 9.2**

  - [ ]* 14.6 Write property test for sort order correctness
    - **Property 33: Sort order correctness**
    - **Validates: Requirements 9.3**

- [ ] 15. Implement Reminder system
  - [ ] 15.1 Create reminder checking logic
    - Implement timer to check for upcoming doses
    - Calculate reminder time based on dose time and preference
    - _Requirements: 4.1_

  - [ ] 15.2 Create ReminderNotification component
    - Display in-app notification with dose details
    - Show patient name, medicine name, dosage, time
    - Add dismiss and mark-as-taken actions
    - _Requirements: 4.2_

  - [ ] 15.3 Implement reminder preferences
    - Add setting for default reminder minutes
    - Allow per-medicine reminder customization
    - _Requirements: 4.3_

  - [ ]* 15.4 Write property test for reminder timing calculation
    - **Property 14: Reminder timing calculation**
    - **Validates: Requirements 4.1**

  - [ ]* 15.5 Write property test for reminder content completeness
    - **Property 15: Reminder content completeness**
    - **Validates: Requirements 4.2**

  - [ ]* 15.6 Write property test for reminder preference persistence
    - **Property 16: Reminder preference persistence**
    - **Validates: Requirements 4.3**

- [x] 16. Implement Settings page and data management
  - [x] 16.1 Create SettingsPage
    - Display app preferences
    - Add default reminder time setting
    - Add default low stock threshold setting
    - Add notifications toggle
    - _Requirements: 4.3, 5.3_

  - [x] 16.2 Implement data export functionality
    - Create exportData() function
    - Generate JSON file with all data
    - Trigger browser download
    - _Requirements: 8.1_

  - [x] 16.3 Implement data import functionality
    - Create file upload input
    - Validate imported JSON structure
    - Show validation errors if invalid
    - Merge or replace data based on user choice
    - _Requirements: 8.2, 8.3, 8.4_

  - [ ]* 16.4 Write property test for export data completeness
    - **Property 28: Export data completeness**
    - **Validates: Requirements 8.1**

  - [ ]* 16.5 Write property test for import validation
    - **Property 29: Import validation rejects invalid data**
    - **Validates: Requirements 8.2**

  - [ ]* 16.6 Write property test for valid import succeeds
    - **Property 30: Valid import succeeds**
    - **Validates: Requirements 8.4**

- [ ] 17. Implement undo functionality
  - [ ] 17.1 Create undo system
    - Implement undo stack for delete operations
    - Store deleted data temporarily (10 seconds)
    - Create undo() function to restore data
    - _Requirements: 11.4_

  - [ ] 17.2 Integrate UndoToast with delete operations
    - Show toast after patient/medicine deletion
    - Add undo button to toast
    - Auto-dismiss after 10 seconds
    - _Requirements: 11.4_

  - [ ]* 17.3 Write property test for undo functionality timing
    - **Property 38: Undo functionality timing**
    - **Validates: Requirements 11.4**

- [ ] 18. Implement loading states and error handling
  - [ ] 18.1 Add loading indicators to all async operations
    - Show spinner during data save
    - Show spinner during data load
    - Show spinner during import/export
    - _Requirements: 12.4_

  - [ ] 18.2 Implement error boundaries
    - Create ErrorBoundary component
    - Wrap major sections
    - Display fallback UI on errors
    - _Requirements: 12.5_

  - [ ] 18.3 Add error messages for all failure scenarios
    - Storage failures
    - Validation failures
    - Import failures
    - Display user-friendly messages
    - _Requirements: 12.5_

  - [ ]* 18.4 Write property test for loading indicator display
    - **Property 42: Loading indicator display**
    - **Validates: Requirements 12.4**

  - [ ]* 18.5 Write property test for error message display
    - **Property 43: Error message display on failure**
    - **Validates: Requirements 12.5**

- [ ] 19. Implement inline validation
  - [ ] 19.1 Add real-time validation to all form fields
    - Validate on blur and on change
    - Show inline error messages
    - Update validation state immediately
    - _Requirements: 12.2_

  - [ ]* 19.2 Write property test for inline validation feedback
    - **Property 40: Inline validation feedback**
    - **Validates: Requirements 12.2**

- [ ] 20. Styling and responsive design
  - [ ] 20.1 Apply Tailwind styles to all components
    - Use healthcare color palette (blues, whites, soft greens)
    - Ensure minimum 16px base font size
    - Ensure 44x44px minimum touch targets
    - Add proper spacing and padding
    - _Requirements: 10.3, 10.4_

  - [ ] 20.2 Implement responsive breakpoints
    - Mobile: <768px (bottom tab bar, single column)
    - Tablet: 768-1024px (adapted layout)
    - Desktop: >1024px (sidebar, multi-column)
    - _Requirements: 10.1_

  - [ ] 20.3 Test and refine mobile experience
    - Verify touch targets
    - Test scrolling behavior
    - Ensure readable text sizes
    - Test on various screen sizes
    - _Requirements: 10.1, 10.3, 10.4_

- [ ] 21. Accessibility implementation
  - [ ] 21.1 Add ARIA labels and semantic HTML
    - Use semantic elements (nav, main, article)
    - Add ARIA labels to icon buttons
    - Add ARIA live regions for notifications
    - Associate labels with form inputs
    - _Requirements: 10.1_

  - [ ] 21.2 Implement keyboard navigation
    - Ensure logical tab order
    - Add keyboard shortcuts for common actions
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - _Requirements: 10.1_

  - [ ] 21.3 Verify color contrast ratios
    - Check all text meets 4.5:1 ratio
    - Check UI components meet 3:1 ratio
    - Ensure status colors are distinguishable
    - _Requirements: 2.5_

- [x] 22. Final integration and testing
  - [x] 22.1 Wire up all routes in React Router
    - Configure all page routes
    - Add 404 page
    - Test navigation between pages
    - _Requirements: All_

  - [x] 22.2 Test complete user flows
    - Patient creation → Medicine assignment → Dose tracking
    - Medicine deletion → Dose cascade
    - Stock tracking → Low stock alert → Refill
    - Data export → Import → Verification
    - _Requirements: All_

  - [x] 22.3 Ensure all tests pass
    - Run all unit tests
    - Run all property-based tests
    - Fix any failing tests
    - Verify test coverage
    - _Requirements: All_

- [ ] 23. Build optimization and deployment preparation
  - [ ] 23.1 Optimize bundle size
    - Implement code splitting by route
    - Lazy load heavy components
    - Analyze bundle with Vite build analyzer
    - Target <500KB initial load
    - _Requirements: All_

  - [ ] 23.2 Create production build
    - Run Vite build
    - Test production build locally
    - Verify all features work in production mode
    - _Requirements: All_

  - [ ] 23.3 Create deployment documentation
    - Document build process
    - Document browser requirements
    - Create user guide for basic features
    - _Requirements: All_
