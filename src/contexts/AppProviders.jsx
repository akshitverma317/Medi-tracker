import React from 'react'
import { StorageProvider } from './StorageContext.jsx'
import { PatientProvider } from './PatientContext.jsx'
import { MedicineProvider } from './MedicineContext.jsx'
import { ScheduleProvider } from './ScheduleContext.jsx'
import { InventoryProvider } from './InventoryContext.jsx'

/**
 * Combined App Providers
 * 
 * Wraps the application with all context providers in the correct order.
 * Order matters: StorageProvider must be outermost, then Patient, Medicine, Schedule, Inventory.
 */
export const AppProviders = ({ children }) => {
  return (
    <StorageProvider>
      <PatientProvider>
        <MedicineProvider>
          <ScheduleProvider>
            <InventoryProvider>
              {children}
            </InventoryProvider>
          </ScheduleProvider>
        </MedicineProvider>
      </PatientProvider>
    </StorageProvider>
  )
}

export default AppProviders
