import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSchedule } from '../contexts/ScheduleContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import { useInventory } from '../contexts/InventoryContext.jsx'
import { formatTime } from '../utils/dateHelpers.js'
import { format } from 'date-fns'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx'
import DoseItem from '../components/shared/DoseItem.jsx'
import AlertsPanel from '../components/shared/AlertsPanel.jsx'
import alertService from '../services/AlertService.js'

/**
 * Dashboard Page
 * 
 * Today's schedule with quick actions
 */
const Dashboard = () => {
  const { getTodayDoses } = useSchedule()
  const { patients, selectedPatientId, getPatient } = usePatients()
  const { getMedicinesByPatient } = useMedicines()
  const { getLowStockMedicines } = useInventory()

  // Get today's doses
  const todayDoses = useMemo(() => {
    return getTodayDoses(selectedPatientId)
  }, [getTodayDoses, selectedPatientId])

  // Get low stock medicines
  const lowStockMedicines = useMemo(() => {
    return getLowStockMedicines()
  }, [getLowStockMedicines])

  // Get smart alerts for selected patient
  const alerts = useMemo(() => {
    if (!selectedPatientId) return []
    
    const patient = getPatient(selectedPatientId)
    if (!patient) return []
    
    const medicines = getMedicinesByPatient(selectedPatientId)
    return alertService.getAllAlerts(patient, medicines, medicines)
  }, [selectedPatientId, getPatient, getMedicinesByPatient])

  // Group doses by status
  const dosesByStatus = useMemo(() => {
    const groups = {
      overdue: [],
      upcoming: [],
      taken: [],
      missed: []
    }

    todayDoses.forEach(dose => {
      if (groups[dose.status]) {
        groups[dose.status].push(dose)
      }
    })

    return groups
  }, [todayDoses])

  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  if (patients.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No Patients Yet"
        message="Start by adding a patient to track their medications."
        actionLabel="Add Patient"
        onAction={() => window.location.href = '/patients/add'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-800">Today's Schedule</h2>
          <p className="text-neutral-600 mt-1">{today}</p>
        </div>
        
        <Link to="/medicines/add">
          <Button variant="primary" className="hidden md:inline-flex">
            + Quick Add
          </Button>
        </Link>
      </div>

      {/* Smart Alerts Panel */}
      {alerts.length > 0 && (
        <AlertsPanel alerts={alerts} />
      )}

      {/* Low Stock Alerts */}
      {lowStockMedicines.length > 0 && (
        <Card className="bg-warning-50 border-l-4 border-warning-500">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-warning-800">Low Stock Alert</h3>
              <p className="text-sm text-warning-700 mt-1">
                {lowStockMedicines.length} medicine{lowStockMedicines.length !== 1 ? 's' : ''} running low on stock
              </p>
            </div>
            <Link to="/inventory">
              <Button variant="warning" size="small">
                View Inventory
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Overdue Doses */}
      {dosesByStatus.overdue.length > 0 && (
        <Card title="⚠️ Overdue" className="border-l-4 border-danger-500">
          <div className="space-y-3">
            {dosesByStatus.overdue.map(dose => (
              <DoseItem key={dose.id} dose={dose} />
            ))}
          </div>
        </Card>
      )}

      {/* Upcoming Doses */}
      {dosesByStatus.upcoming.length > 0 && (
        <Card title="📅 Upcoming" className="border-l-4 border-primary-500">
          <div className="space-y-3">
            {dosesByStatus.upcoming.map(dose => (
              <DoseItem key={dose.id} dose={dose} />
            ))}
          </div>
        </Card>
      )}

      {/* Taken Doses */}
      {dosesByStatus.taken.length > 0 && (
        <Card title="✅ Completed" className="border-l-4 border-success-500">
          <div className="space-y-3">
            {dosesByStatus.taken.map(dose => (
              <DoseItem key={dose.id} dose={dose} />
            ))}
          </div>
        </Card>
      )}

      {/* Missed Doses */}
      {dosesByStatus.missed.length > 0 && (
        <Card title="❌ Missed" className="border-l-4 border-danger-500">
          <div className="space-y-3">
            {dosesByStatus.missed.map(dose => (
              <DoseItem key={dose.id} dose={dose} />
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {todayDoses.length === 0 && (
        <EmptyState
          icon="📅"
          title="No Doses Scheduled Today"
          message="There are no medicines scheduled for today. Add medicines to start tracking."
          actionLabel="Add Medicine"
          onAction={() => window.location.href = '/medicines/add'}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-primary-600">
            {todayDoses.length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Total Doses</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-success-600">
            {dosesByStatus.taken.length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Taken</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-warning-600">
            {dosesByStatus.upcoming.length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Upcoming</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-danger-600">
            {dosesByStatus.overdue.length + dosesByStatus.missed.length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Overdue/Missed</div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
