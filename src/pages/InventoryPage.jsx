import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useInventory } from '../contexts/InventoryContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import { format } from 'date-fns'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Badge from '../components/shared/Badge.jsx'
import Input from '../components/shared/Input.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx'

/**
 * InventoryPage Component
 * 
 * Stock levels, refill tracking, and inventory management
 */
const InventoryPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getLowStockMedicines, getMedicinesNeedingRefill, getInventorySummary, addRefill, updateRefill, deleteRefill, getRefillsByMedicine, calculateRefillDate, refillRecords } = useInventory()
  const { medicines, getMedicine, deleteMedicine } = useMedicines()
  const { getPatient } = usePatients()
  const [refillDialog, setRefillDialog] = useState(null)
  const [editRefillDialog, setEditRefillDialog] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteMedicineConfirm, setDeleteMedicineConfirm] = useState(null)

  const lowStockMedicines = getLowStockMedicines()
  const needsRefillSoon = getMedicinesNeedingRefill(7)
  const summary = getInventorySummary()

  const handleRefill = (medicine) => {
    setRefillDialog({ medicine, quantity: '', notes: '' })
  }

  const handleDeleteMedicine = (medicine) => {
    setDeleteMedicineConfirm(medicine)
  }

  const confirmDeleteMedicine = () => {
    if (!deleteMedicineConfirm) return

    const result = deleteMedicine(deleteMedicineConfirm.id)
    
    if (result.success) {
      setDeleteMedicineConfirm(null)
    } else {
      alert(result.error || 'Failed to delete medicine')
    }
  }

  const submitRefill = () => {
    if (!refillDialog || !refillDialog.quantity) return

    const quantity = parseInt(refillDialog.quantity, 10)
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    const result = addRefill(refillDialog.medicine.id, quantity, refillDialog.notes)
    
    if (result.success) {
      setRefillDialog(null)
    } else {
      alert(result.error || 'Failed to record refill')
    }
  }

  const handleEditRefill = (refill) => {
    const medicine = getMedicine(refill.medicineId)
    setEditRefillDialog({
      refill,
      medicine,
      quantity: refill.quantityAdded.toString(),
      notes: refill.notes
    })
  }

  const submitEditRefill = () => {
    if (!editRefillDialog || !editRefillDialog.quantity) return

    const quantity = parseInt(editRefillDialog.quantity, 10)
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    const result = updateRefill(editRefillDialog.refill.id, quantity, editRefillDialog.notes)
    
    if (result.success) {
      setEditRefillDialog(null)
    } else {
      alert(result.error || 'Failed to update refill')
    }
  }

  const handleDeleteRefill = (refill) => {
    const medicine = getMedicine(refill.medicineId)
    setDeleteConfirm({ refill, medicine })
  }

  const confirmDeleteRefill = () => {
    if (!deleteConfirm) return

    const result = deleteRefill(deleteConfirm.refill.id)
    
    if (result.success) {
      setDeleteConfirm(null)
    } else {
      alert(result.error || 'Failed to delete refill')
    }
  }

  if (medicines.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No Medicines in Inventory"
        message="Add medicines to start tracking stock levels and refills."
        actionLabel="Add Medicine"
        onAction={() => window.location.href = '/medicines/add'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-800">Inventory</h2>
        <p className="text-neutral-600 mt-1">
          Stock levels and refill tracking
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-primary-600">
            {summary.totalMedicines}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Total Medicines</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-danger-600">
            {summary.outOfStockCount}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Out of Stock</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-warning-600">
            {summary.lowStockCount}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Low Stock</div>
        </Card>

        <Card padding="normal" className="text-center">
          <div className="text-3xl font-bold text-success-600">
            {summary.totalStock}
          </div>
          <div className="text-sm text-neutral-600 mt-1">Total Doses</div>
        </Card>
      </div>

      {/* Critical Alerts */}
      {summary.outOfStockCount > 0 && (
        <Card className="bg-danger-50 border-l-4 border-danger-500">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div className="flex-1">
              <h3 className="font-semibold text-danger-800">Out of Stock Alert</h3>
              <p className="text-sm text-danger-700 mt-1">
                {summary.outOfStockCount} medicine{summary.outOfStockCount !== 1 ? 's are' : ' is'} out of stock
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Low Stock Medicines */}
      {lowStockMedicines.length > 0 && (
        <Card title="⚠️ Low Stock Medicines">
          <div className="space-y-3">
            {lowStockMedicines.map((medicine) => {
              const patient = getPatient(medicine.patientId)
              const refillDate = calculateRefillDate(medicine.id)

              return (
                <div
                  key={medicine.id}
                  className="flex items-center gap-4 p-4 bg-warning-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-800 truncate">
                      {medicine.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Patient: {patient?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-warning-700">
                      Stock: {medicine.stockQuantity} / Threshold: {medicine.lowStockThreshold}
                    </p>
                    {refillDate && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Refill needed by: {format(new Date(refillDate), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>

                  {user?.permissions?.canManageInventory && (
                    <Button
                      variant="warning"
                      size="small"
                      onClick={() => handleRefill(medicine)}
                    >
                      Record Refill
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Inventory by Patient */}
      {(() => {
        // Group medicines by patient
        const patientGroups = {}
        medicines.forEach(medicine => {
          if (!patientGroups[medicine.patientId]) {
            patientGroups[medicine.patientId] = []
          }
          patientGroups[medicine.patientId].push(medicine)
        })

        return Object.entries(patientGroups).map(([patientId, patientMedicines]) => {
          const patient = getPatient(patientId)
          if (!patient) return null

          return (
            <Card key={patientId} title={`📋 ${patient.name}'s Medicines`}>
              <div className="space-y-3">
                {patientMedicines.map((medicine) => {
                  const refills = getRefillsByMedicine(medicine.id)
                  const isLowStock = medicine.stockQuantity <= medicine.lowStockThreshold
                  const isOutOfStock = medicine.stockQuantity === 0

                  return (
                    <div
                      key={medicine.id}
                      className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-neutral-800 truncate">
                          {medicine.name}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {medicine.dosage}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Last refill: {refills.length > 0 ? format(new Date(refills[0].date), 'MMM d, yyyy') : 'Never'}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <Badge variant={isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'success'}>
                          {medicine.stockQuantity} doses
                        </Badge>
                      </div>

                      <div className="flex-shrink-0 flex gap-2">
                        {user?.permissions?.canManageInventory && (
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleRefill(medicine)}
                          >
                            Refill
                          </Button>
                        )}
                        
                        {user?.permissions?.canEditMedicines && (
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => navigate(`/medicines/${medicine.id}/edit`)}
                            title="Edit medicine"
                          >
                            ✏️
                          </Button>
                        )}
                        
                        {user?.permissions?.canDeleteMedicines && (
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDeleteMedicine(medicine)}
                            title="Delete medicine"
                          >
                            🗑️
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })
      })()}

      {/* Refill Dialog */}
      {refillDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              Record Refill: {refillDialog.medicine.name}
            </h3>

            <div className="space-y-4">
              <Input
                label="Quantity Added"
                type="number"
                required
                value={refillDialog.quantity}
                onChange={(e) => setRefillDialog(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Number of doses"
                min="1"
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={refillDialog.notes}
                  onChange={(e) => setRefillDialog(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any notes about this refill"
                  rows="3"
                  className="input"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setRefillDialog(null)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={submitRefill}
                  fullWidth
                >
                  Record Refill
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Refill Dialog */}
      {editRefillDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              Edit Refill: {editRefillDialog.medicine.name}
            </h3>

            <div className="space-y-4">
              <Input
                label="Quantity Added"
                type="number"
                required
                value={editRefillDialog.quantity}
                onChange={(e) => setEditRefillDialog(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Number of doses"
                min="1"
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={editRefillDialog.notes}
                  onChange={(e) => setEditRefillDialog(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any notes about this refill"
                  rows="3"
                  className="input"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setEditRefillDialog(null)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={submitEditRefill}
                  fullWidth
                >
                  Update Refill
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-semibold text-danger-600 mb-4">
              Delete Refill Record
            </h3>

            <div className="space-y-4">
              <p className="text-neutral-700">
                Are you sure you want to delete this refill record?
              </p>
              
              <div className="bg-neutral-50 p-3 rounded">
                <p className="font-semibold text-neutral-800">{deleteConfirm.medicine.name}</p>
                <p className="text-sm text-neutral-600">
                  +{deleteConfirm.refill.quantityAdded} doses • {format(new Date(deleteConfirm.refill.date), 'MMM d, yyyy')}
                </p>
                {deleteConfirm.refill.notes && (
                  <p className="text-xs text-neutral-500 mt-1">{deleteConfirm.refill.notes}</p>
                )}
              </div>

              <p className="text-sm text-danger-600">
                ⚠️ This will subtract {deleteConfirm.refill.quantityAdded} doses from the current stock.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteConfirm(null)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDeleteRefill}
                  fullWidth
                >
                  Delete Refill
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Medicine Confirmation Dialog */}
      {deleteMedicineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-semibold text-danger-600 mb-4">
              Delete Medicine
            </h3>

            <div className="space-y-4">
              <p className="text-neutral-700">
                Are you sure you want to delete this medicine?
              </p>
              
              <div className="bg-neutral-50 p-3 rounded">
                <p className="font-semibold text-neutral-800">{deleteMedicineConfirm.name}</p>
                <p className="text-sm text-neutral-600">{deleteMedicineConfirm.dosage}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Current stock: {deleteMedicineConfirm.stockQuantity} doses
                </p>
              </div>

              <p className="text-sm text-danger-600">
                ⚠️ This will permanently delete the medicine and all its associated schedules and history.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteMedicineConfirm(null)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDeleteMedicine}
                  fullWidth
                >
                  Delete Medicine
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default InventoryPage
