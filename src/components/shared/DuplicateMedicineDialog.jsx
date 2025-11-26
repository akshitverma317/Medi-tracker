import React from 'react'
import Card from './Card.jsx'
import Button from './Button.jsx'
import Badge from './Badge.jsx'

/**
 * DuplicateMedicineDialog Component
 * 
 * Warns user about duplicate medicines and offers options
 */
const DuplicateMedicineDialog = ({ 
  isOpen, 
  onClose, 
  onUseExisting, 
  onCreateNew,
  newMedicine,
  existingMedicines 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="max-w-2xl w-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-warning-800">
                Duplicate Medicine Detected
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                A medicine with the same name and dosage already exists
              </p>
            </div>
          </div>

          {/* New Medicine Info */}
          <div className="bg-info-50 border-l-4 border-info-500 p-4 rounded">
            <p className="text-sm font-medium text-info-800 mb-2">
              You're trying to add:
            </p>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold text-neutral-800">
                {newMedicine.name}
              </p>
              <p className="text-sm text-neutral-600">
                {newMedicine.dosage}
              </p>
            </div>
          </div>

          {/* Existing Medicines */}
          <div className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded">
            <p className="text-sm font-medium text-warning-800 mb-2">
              Similar medicine(s) already exist - Click to select:
            </p>
            <div className="space-y-2">
              {existingMedicines.map((medicine, index) => (
                <button
                  key={index}
                  onClick={() => onUseExisting(medicine)}
                  className="w-full bg-white p-3 rounded flex items-center justify-between hover:bg-primary-50 hover:border-primary-300 border-2 border-transparent transition-all cursor-pointer text-left"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-800">
                      {medicine.name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {medicine.dosage} • Patient: {medicine.patientName}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Stock: {medicine.stockQuantity} doses
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={medicine.stockQuantity > 0 ? 'success' : 'danger'}>
                      {medicine.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    <span className="text-primary-600 text-sm">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="bg-neutral-50 p-4 rounded">
            <p className="text-sm font-medium text-neutral-800 mb-3">
              What would you like to do?
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">
                    Recommended: Use existing medicine
                  </p>
                  <p className="text-xs text-neutral-600">
                    Select an existing medicine above to avoid duplicates and manage inventory better
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">➕</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">
                    Create new medicine anyway
                  </p>
                  <p className="text-xs text-neutral-600">
                    Only if this is for a different patient or you need separate inventory tracking
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              onClick={onCreateNew}
              fullWidth
            >
              ➕ Create New Anyway
            </Button>
          </div>

          <p className="text-xs text-center text-neutral-500">
            💡 Tip: Click on any medicine above to use it, or create a new one if needed
          </p>
        </div>
      </Card>
    </div>
  )
}

export default DuplicateMedicineDialog
