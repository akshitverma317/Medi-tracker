import React, { useState, useMemo } from 'react'
import { useSchedule } from '../contexts/ScheduleContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import { format } from 'date-fns'
import { formatDateISO } from '../utils/dateHelpers.js'
import Card from '../components/shared/Card.jsx'
import Badge from '../components/shared/Badge.jsx'
import Button from '../components/shared/Button.jsx'
import Select from '../components/shared/Select.jsx'
import DatePicker from '../components/shared/DatePicker.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'

/**
 * HistoryPage Component
 * 
 * Medication history log with filtering
 */
const HistoryPage = () => {
  const { getDoseHistory, undoDose } = useSchedule()
  const { getMedicine } = useMedicines()
  const { patients, getPatient } = usePatients()

  const [filters, setFilters] = useState({
    patientId: '',
    status: '',
    startDate: '',
    endDate: ''
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleUndo = async (dose) => {
    if (!confirm('Are you sure you want to undo this dose? It will be marked as pending again.')) {
      return
    }
    
    setIsProcessing(true)
    const result = undoDose(dose)
    setIsProcessing(false)

    if (!result.success) {
      alert(result.error || 'Failed to undo dose')
    }
  }

  // Get filtered history
  const history = useMemo(() => {
    const filterObj = {}
    
    if (filters.patientId) filterObj.patientId = filters.patientId
    if (filters.status) filterObj.status = filters.status
    if (filters.startDate) filterObj.startDate = filters.startDate
    if (filters.endDate) filterObj.endDate = filters.endDate

    return getDoseHistory(filterObj)
  }, [getDoseHistory, filters])

  // Calculate stats
  const stats = useMemo(() => {
    const taken = history.filter(d => d.status === 'taken').length
    const missed = history.filter(d => d.status === 'missed').length
    const total = taken + missed
    const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0

    return { taken, missed, total, adherenceRate }
  }, [history])

  const patientOptions = [
    { value: '', label: 'All Patients' },
    ...patients.map(p => ({ value: p.id, label: p.name }))
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'taken', label: 'Taken' },
    { value: 'missed', label: 'Missed' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-800">History</h2>
        <p className="text-neutral-600 mt-1">
          Medication adherence and dose history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-primary-600">
            {stats.total}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Total Doses</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-success-600">
            {stats.taken}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Taken</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-danger-600">
            {stats.missed}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Missed</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-primary-600">
            {stats.adherenceRate}%
          </div>
          <div className="text-sm text-neutral-600 mt-1">Adherence</div>
        </Card>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Patient"
            value={filters.patientId}
            onChange={(e) => setFilters(prev => ({ ...prev, patientId: e.target.value }))}
            options={patientOptions}
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
          />

          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          />

          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            min={filters.startDate}
          />
        </div>
      </Card>

      {/* History List */}
      <Card title={`History (${history.length} records)`}>
        {history.length === 0 ? (
          <EmptyState
            icon="📊"
            title="No History Records"
            message="No dose records match your filter criteria."
          />
        ) : (
          <div className="space-y-2">
            {history.map((dose) => {
              const medicine = getMedicine(dose.medicineId)
              const patient = getPatient(dose.patientId)

              if (!medicine || !patient) return null

              return (
                <div
                  key={dose.id}
                  className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
                >
                  {/* Date & Time */}
                  <div className="flex-shrink-0 text-center min-w-[100px]">
                    <div className="text-sm font-medium text-neutral-800">
                      {format(new Date(dose.scheduledTime), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {format(new Date(dose.scheduledTime), 'h:mm a')}
                    </div>
                  </div>

                  {/* Medicine & Patient Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-800 truncate">
                      {medicine.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {medicine.dosage} • {patient.name}
                    </p>
                    {dose.notes && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Note: {dose.notes}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    <Badge status={dose.status} />
                  </div>

                  {/* Actual Time */}
                  {dose.actualTime && (
                    <div className="flex-shrink-0 text-right min-w-[80px]">
                      <div className="text-xs text-neutral-600">
                        {dose.status === 'taken' ? 'Taken at' : 'Marked at'}
                      </div>
                      <div className="text-sm font-medium text-neutral-800">
                        {format(new Date(dose.actualTime), 'h:mm a')}
                      </div>
                    </div>
                  )}

                  {/* Undo Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleUndo(dose)}
                      disabled={isProcessing}
                      aria-label="Undo dose"
                      title="Reset this dose to pending"
                    >
                      ↺ Undo
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export default HistoryPage
