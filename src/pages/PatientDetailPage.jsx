import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePatients } from '../contexts/PatientContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Badge from '../components/shared/Badge.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'

/**
 * PatientDetailPage Component
 * 
 * Display patient information and all assigned medicines
 */
const PatientDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPatient } = usePatients()
  const { getMedicinesByPatient } = useMedicines()

  const patient = getPatient(id)
  const medicines = patient ? getMedicinesByPatient(patient.id) : []

  if (!patient) {
    return (
      <EmptyState
        icon="❌"
        title="Patient Not Found"
        message="The patient you're looking for doesn't exist."
        actionLabel="Back to Patients"
        onAction={() => navigate('/patients')}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/patients')}
          aria-label="Back to patients"
        >
          ← Back
        </Button>
        
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-neutral-800">{patient.name}</h2>
          <p className="text-neutral-600 mt-1">Patient Details</p>
        </div>

        <Link to={`/patients/${patient.id}/edit`}>
          <Button variant="outline">
            ✏️ Edit
          </Button>
        </Link>
      </div>

      {/* Patient Information Card */}
      <Card title="Patient Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-4xl">
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
            <div>
              <h3 className="text-xl font-semibold text-neutral-800">
                {patient.name}
              </h3>
              <p className="text-neutral-600">Age: {patient.age}</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-700">Caregiver</label>
              <p className="text-neutral-800">{patient.caregiverName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-700">Patient ID</label>
              <p className="text-neutral-600 text-sm font-mono">{patient.id}</p>
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        {patient.medicalConditions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h4 className="font-semibold text-neutral-800 mb-3">Medical Conditions</h4>
            <div className="flex flex-wrap gap-2">
              {patient.medicalConditions.map((condition, index) => (
                <Badge key={index} variant="primary">
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {patient.allergies.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h4 className="font-semibold text-danger-800 mb-3">⚠️ Allergies</h4>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <Badge key={index} variant="danger">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Medicines Card */}
      <Card
        title="Assigned Medicines"
        subtitle={`${medicines.length} medicine${medicines.length !== 1 ? 's' : ''}`}
        actions={
          <Link to="/medicines/add">
            <Button variant="primary" size="small">
              + Add Medicine
            </Button>
          </Link>
        }
      >
        {medicines.length === 0 ? (
          <EmptyState
            icon="💊"
            title="No Medicines"
            message="This patient doesn't have any medicines assigned yet."
            actionLabel="Add Medicine"
            onAction={() => navigate('/medicines/add')}
          />
        ) : (
          <div className="space-y-3">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="flex-shrink-0 text-3xl">
                  💊
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-800 truncate">
                    {medicine.name}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {medicine.dosage} • {medicine.frequency}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Times: {medicine.timings.join(', ')}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Badge variant={medicine.stockQuantity <= medicine.lowStockThreshold ? 'warning' : 'success'}>
                    Stock: {medicine.stockQuantity}
                  </Badge>
                </div>

                <Link to={`/medicines/${medicine.id}`}>
                  <Button variant="outline" size="small">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-primary-600">
            {medicines.length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Medicines</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-success-600">
            {medicines.reduce((sum, m) => sum + m.timings.length, 0)}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Daily Doses</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-warning-600">
            {medicines.filter(m => m.stockQuantity <= m.lowStockThreshold).length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Low Stock</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-neutral-600">
            {patient.medicalConditions.length + patient.allergies.length}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Conditions</div>
        </Card>
      </div>
    </div>
  )
}

export default PatientDetailPage
