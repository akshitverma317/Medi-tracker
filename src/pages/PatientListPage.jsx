import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx'
import UndoToast from '../components/shared/UndoToast.jsx'

/**
 * PatientListPage Component
 * 
 * Display all patients with medicine counts and actions
 */
const PatientListPage = () => {
  const { user } = useAuth()
  const { patients, deletePatient, selectPatient, selectedPatientId } = usePatients()
  const { getMedicinesByPatient } = useMedicines()
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [undoData, setUndoData] = useState(null)

  const handleDelete = (patient) => {
    setDeleteConfirm(patient)
  }

  const confirmDelete = () => {
    if (!deleteConfirm) return

    const result = deletePatient(deleteConfirm.id)
    
    if (result.success) {
      setUndoData({
        message: `Deleted ${deleteConfirm.name}`,
        patient: result.deletedPatient
      })
    } else {
      alert(result.error || 'Failed to delete patient')
    }

    setDeleteConfirm(null)
  }

  const handleUndo = () => {
    // Note: Undo functionality would need to be implemented in PatientContext
    // For now, just dismiss the toast
    setUndoData(null)
  }

  const handleSelectPatient = (patientId) => {
    selectPatient(patientId)
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No Patients Yet"
        message="Start by adding a patient to track their medications and schedules."
        actionLabel="Add Patient"
        onAction={() => window.location.href = '/patients/add'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-800">Patients</h2>
          <p className="text-neutral-600 mt-1">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        
        {user?.permissions?.canEditPatients && (
          <Link to="/patients/add">
            <Button variant="primary">
              + Add Patient
            </Button>
          </Link>
        )}
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => {
          const medicines = getMedicinesByPatient(patient.id)
          const isSelected = selectedPatientId === patient.id

          return (
            <Card
              key={patient.id}
              className={`relative ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </span>
                </div>
              )}

              {/* Patient Info */}
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {patient.photo ? (
                      <img
                        src={patient.photo}
                        alt={patient.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      '👤'
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-800 truncate">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Age: {patient.age}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Caregiver: {patient.caregiverName}
                    </p>
                  </div>
                </div>

                {/* Medical Info */}
                {(patient.medicalConditions.length > 0 || patient.allergies.length > 0) && (
                  <div className="mt-3 space-y-1">
                    {patient.medicalConditions.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-neutral-700">Conditions:</span>{' '}
                        <span className="text-neutral-600">
                          {patient.medicalConditions.join(', ')}
                        </span>
                      </div>
                    )}
                    {patient.allergies.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-danger-700">Allergies:</span>{' '}
                        <span className="text-danger-600">
                          {patient.allergies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-4 py-3 border-t border-neutral-200">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-primary-600">
                    {medicines.length}
                  </div>
                  <div className="text-xs text-neutral-600">Medicines</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant={isSelected ? 'secondary' : 'primary'}
                  size="small"
                  fullWidth
                  onClick={() => handleSelectPatient(patient.id)}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </Button>
                
                <Link to={`/patients/${patient.id}`} className="flex-1">
                  <Button variant="outline" size="small" fullWidth>
                    View
                  </Button>
                </Link>
                
                {user?.permissions?.canDeletePatients && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(patient)}
                    aria-label="Delete patient"
                  >
                    🗑️
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This will also delete all associated medicines and dose records.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Undo Toast */}
      <UndoToast
        isVisible={!!undoData}
        message={undoData?.message || ''}
        onUndo={handleUndo}
        onDismiss={() => setUndoData(null)}
      />
    </div>
  )
}

export default PatientListPage
