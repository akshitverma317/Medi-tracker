import React, { useState } from 'react'
import { useSchedule } from '../../contexts/ScheduleContext.jsx'
import { useMedicines } from '../../contexts/MedicineContext.jsx'
import { usePatients } from '../../contexts/PatientContext.jsx'
import { formatTime } from '../../utils/dateHelpers.js'
import { format } from 'date-fns'
import Badge from './Badge.jsx'
import Button from './Button.jsx'
import { DOSE_STATUS } from '../../types/constants.js'

/**
 * DoseItem Component
 * 
 * Individual dose with status and quick mark-as-taken functionality
 */
const DoseItem = ({ dose }) => {
  const { markDoseTaken, markDoseMissed, undoDose } = useSchedule()
  const { getMedicine } = useMedicines()
  const { getPatient } = usePatients()
  const [isProcessing, setIsProcessing] = useState(false)

  const medicine = getMedicine(dose.medicineId)
  const patient = getPatient(dose.patientId)

  if (!medicine || !patient) {
    return null
  }

  const scheduledTime = formatTime(new Date(dose.scheduledTime))
  const actualTime = dose.actualTime ? formatTime(new Date(dose.actualTime)) : null

  const handleMarkTaken = async () => {
    setIsProcessing(true)
    // Pass the entire dose object instead of just the ID
    const result = markDoseTaken(dose)
    setIsProcessing(false)

    if (!result.success) {
      alert(result.error || 'Failed to mark dose as taken')
    }
  }

  const handleMarkMissed = async () => {
    setIsProcessing(true)
    // Pass the entire dose object instead of just the ID
    const result = markDoseMissed(dose)
    setIsProcessing(false)

    if (!result.success) {
      alert(result.error || 'Failed to mark dose as missed')
    }
  }

  const handleUndo = async () => {
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

  const canMarkTaken = dose.status === DOSE_STATUS.UPCOMING || dose.status === DOSE_STATUS.OVERDUE
  const canMarkMissed = dose.status === DOSE_STATUS.UPCOMING || dose.status === DOSE_STATUS.OVERDUE
  const canUndo = dose.status === DOSE_STATUS.TAKEN || dose.status === DOSE_STATUS.MISSED

  return (
    <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
      {/* Time */}
      <div className="flex-shrink-0 text-center min-w-[60px]">
        <div className="text-lg font-bold text-neutral-800">{scheduledTime}</div>
        {actualTime && dose.status === DOSE_STATUS.TAKEN && (
          <div className="text-xs text-success-600">✓ {actualTime}</div>
        )}
        {actualTime && dose.status === DOSE_STATUS.MISSED && (
          <div className="text-xs text-danger-600">✗ {actualTime}</div>
        )}
      </div>

      {/* Medicine Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-neutral-800 truncate">
          {medicine.name}
        </div>
        <div className="text-sm text-neutral-600">
          {medicine.dosage} • {patient.name}
        </div>
        {medicine.notes && (
          <div className="text-xs text-neutral-500 mt-1 truncate">
            {medicine.notes}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <Badge status={dose.status} />
      </div>

      {/* Actions */}
      {canMarkTaken && (
        <div className="flex-shrink-0 flex gap-2">
          <Button
            variant="success"
            size="small"
            onClick={handleMarkTaken}
            disabled={isProcessing}
            aria-label="Mark as taken"
          >
            ✓ Taken
          </Button>
          {canMarkMissed && (
            <Button
              variant="danger"
              size="small"
              onClick={handleMarkMissed}
              disabled={isProcessing}
              className="hidden md:inline-flex"
              aria-label="Mark as missed"
            >
              ✗ Missed
            </Button>
          )}
        </div>
      )}
      
      {/* Undo Action */}
      {canUndo && (
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            size="small"
            onClick={handleUndo}
            disabled={isProcessing}
            aria-label="Undo dose"
            title="Reset this dose to pending"
          >
            ↺ Undo
          </Button>
        </div>
      )}
    </div>
  )
}

export default DoseItem
