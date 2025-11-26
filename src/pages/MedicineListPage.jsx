import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Badge from '../components/shared/Badge.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import Select from '../components/shared/Select.jsx'
import Input from '../components/shared/Input.jsx'

/**
 * MedicineListPage Component
 * 
 * Display all medicines with search and filter
 */
const MedicineListPage = () => {
  const { user } = useAuth()
  const { medicines, searchMedicines, sortMedicines } = useMedicines()
  const { patients } = usePatients()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPatient, setFilterPatient] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Apply filters and sorting
  let filteredMedicines = medicines

  // Search
  if (searchQuery) {
    filteredMedicines = searchMedicines(searchQuery)
  }

  // Filter by patient
  if (filterPatient) {
    filteredMedicines = filteredMedicines.filter(m => m.patientId === filterPatient)
  }

  // Sort
  filteredMedicines = sortMedicines(filteredMedicines, sortBy)

  const patientOptions = [
    { value: '', label: 'All Patients' },
    ...patients.map(p => ({ value: p.id, label: p.name }))
  ]

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'patient', label: 'Patient' },
    { value: 'time', label: 'First Dose Time' },
    { value: 'stock', label: 'Stock Level' }
  ]

  if (medicines.length === 0) {
    return (
      <EmptyState
        icon="💊"
        title="No Medicines Yet"
        message="Start by adding medicines to track medication schedules."
        actionLabel="Add Medicine"
        onAction={() => window.location.href = '/medicines/add'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-800">Medicines</h2>
          <p className="text-neutral-600 mt-1">
            {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        
        {user?.permissions?.canEditMedicines && (
          <Link to="/medicines/add">
            <Button variant="primary">
              + Add Medicine
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <Select
            value={filterPatient}
            onChange={(e) => setFilterPatient(e.target.value)}
            options={patientOptions}
          />
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
          />
        </div>
      </Card>

      {/* Medicine List */}
      {filteredMedicines.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Results"
          message="No medicines match your search criteria."
        />
      ) : (
        <div className="space-y-3">
          {filteredMedicines.map((medicine) => {
            const patient = patients.find(p => p.id === medicine.patientId)
            const isLowStock = medicine.stockQuantity <= medicine.lowStockThreshold

            return (
              <Card key={medicine.id} padding="normal">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 text-4xl">
                    💊
                  </div>

                  {/* Medicine Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-800 truncate">
                      {medicine.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {medicine.dosage} • {medicine.category}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Patient: {patient?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Times: {medicine.timings.join(', ')}
                    </p>
                  </div>

                  {/* Stock Badge */}
                  <div className="flex-shrink-0">
                    <Badge variant={isLowStock ? 'warning' : 'success'}>
                      Stock: {medicine.stockQuantity}
                    </Badge>
                  </div>

                  {/* Actions */}
                  {user?.permissions?.canEditMedicines && (
                    <div className="flex-shrink-0 flex gap-2">
                      <Link to={`/medicines/${medicine.id}/edit`}>
                        <Button variant="outline" size="small">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MedicineListPage
