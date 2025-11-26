import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import { validateMedicine } from '../utils/validation.js'
import { formatDateISO } from '../utils/dateHelpers.js'
import { MEDICINE_CATEGORIES, MEDICINE_CATEGORY_LABELS, MEDICINE_FREQUENCIES, MEDICINE_FREQUENCY_LABELS, DEFAULT_SETTINGS } from '../types/constants.js'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Input from '../components/shared/Input.jsx'
import Select from '../components/shared/Select.jsx'
import TimePicker from '../components/shared/TimePicker.jsx'
import DatePicker from '../components/shared/DatePicker.jsx'
import FormField from '../components/shared/FormField.jsx'
import DuplicateMedicineDialog from '../components/shared/DuplicateMedicineDialog.jsx'

/**
 * AddEditMedicinePage Component
 * 
 * Comprehensive form for creating or editing a medicine
 */
const AddEditMedicinePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getMedicine, addMedicine, updateMedicine, checkDuplicates } = useMedicines()
  const { patients, getPatient } = usePatients()

  const isEditMode = !!id
  const existingMedicine = isEditMode ? getMedicine(id) : null

  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    dosage: '',
    frequency: '',
    timings: [''],
    category: '',
    notes: '',
    stockQuantity: '0', // Default to 0, managed through Inventory/Refills
    lowStockThreshold: DEFAULT_SETTINGS.defaultLowStockThreshold.toString(),
    reminderMinutesBefore: DEFAULT_SETTINGS.defaultReminderMinutes.toString(),
    startDate: formatDateISO(new Date()),
    endDate: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [duplicateDialog, setDuplicateDialog] = useState(null)

  // Load existing medicine data in edit mode
  useEffect(() => {
    if (existingMedicine) {
      setFormData({
        patientId: existingMedicine.patientId,
        name: existingMedicine.name,
        dosage: existingMedicine.dosage,
        frequency: existingMedicine.frequency,
        timings: existingMedicine.timings,
        category: existingMedicine.category,
        notes: existingMedicine.notes || '',
        stockQuantity: existingMedicine.stockQuantity.toString(),
        lowStockThreshold: existingMedicine.lowStockThreshold.toString(),
        reminderMinutesBefore: existingMedicine.reminderMinutesBefore.toString(),
        startDate: existingMedicine.startDate,
        endDate: existingMedicine.endDate || ''
      })
    }
  }, [existingMedicine])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTimingChange = (index, value) => {
    const newTimings = [...formData.timings]
    newTimings[index] = value
    setFormData(prev => ({ ...prev, timings: newTimings }))
    if (errors.timings) {
      setErrors(prev => ({ ...prev, timings: '' }))
    }
  }

  const addTiming = () => {
    setFormData(prev => ({ ...prev, timings: [...prev.timings, ''] }))
  }

  const removeTiming = (index) => {
    if (formData.timings.length > 1) {
      const newTimings = formData.timings.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, timings: newTimings }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepare data for validation
    const medicineData = {
      patientId: formData.patientId,
      name: formData.name.trim(),
      dosage: formData.dosage.trim(),
      frequency: formData.frequency,
      timings: formData.timings.filter(t => t.trim() !== ''),
      category: formData.category,
      notes: formData.notes.trim(),
      stockQuantity: parseInt(formData.stockQuantity, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10),
      reminderMinutesBefore: parseInt(formData.reminderMinutesBefore, 10),
      startDate: formData.startDate,
      endDate: formData.endDate || undefined
    }

    // Validate
    const validation = validateMedicine(medicineData)
    
    if (!validation.valid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    // Check for duplicates (only when adding new medicine)
    if (!isEditMode) {
      const duplicates = checkDuplicates(medicineData.name, medicineData.dosage)
      
      if (duplicates.length > 0) {
        // Show duplicate dialog
        const duplicatesWithPatientNames = duplicates.map(med => ({
          ...med,
          patientName: getPatient(med.patientId)?.name || 'Unknown'
        }))
        
        setDuplicateDialog({
          newMedicine: medicineData,
          existingMedicines: duplicatesWithPatientNames
        })
        setIsSubmitting(false)
        return
      }
    }

    // Submit
    submitMedicine(medicineData)
  }

  const submitMedicine = (medicineData) => {
    let result
    if (isEditMode) {
      result = updateMedicine(id, medicineData)
    } else {
      result = addMedicine(medicineData)
    }

    setIsSubmitting(false)

    if (result.success) {
      navigate('/medicines')
    } else {
      setErrors(result.errors || { general: 'Failed to save medicine' })
    }
  }

  const handleUseExisting = (existingMedicine) => {
    // Pre-fill form with existing medicine's data
    setFormData({
      patientId: existingMedicine.patientId,
      name: existingMedicine.name,
      dosage: existingMedicine.dosage,
      frequency: existingMedicine.frequency,
      timings: existingMedicine.timings,
      category: existingMedicine.category,
      notes: existingMedicine.notes || '',
      stockQuantity: existingMedicine.stockQuantity.toString(), // Show current stock
      lowStockThreshold: existingMedicine.lowStockThreshold.toString(),
      reminderMinutesBefore: existingMedicine.reminderMinutesBefore.toString(),
      startDate: existingMedicine.startDate,
      endDate: existingMedicine.endDate || ''
    })
    
    // Close dialog and show success message
    setDuplicateDialog(null)
    
    // Show a message that the form was pre-filled
    alert(`Form updated with existing medicine data.\nCurrent stock: ${existingMedicine.stockQuantity} doses\n\nYou can now adjust the schedule as needed.\nManage stock through the Inventory page.`)
  }

  const handleCreateNew = () => {
    // User confirmed they want to create a duplicate
    setIsSubmitting(true)
    submitMedicine(duplicateDialog.newMedicine)
    setDuplicateDialog(null)
  }

  // Prepare options for selects
  const patientOptions = patients.map(p => ({
    value: p.id,
    label: p.name
  }))

  const categoryOptions = Object.entries(MEDICINE_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label
  }))

  const frequencyOptions = Object.entries(MEDICINE_FREQUENCY_LABELS).map(([value, label]) => ({
    value,
    label
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/medicines')}
          aria-label="Back to medicines"
        >
          ← Back
        </Button>
        
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-neutral-800">
            {isEditMode ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <p className="text-neutral-600 mt-1">
            {isEditMode ? 'Update medicine information' : 'Enter medicine details'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-danger-50 border-l-4 border-danger-500 p-4">
            <p className="text-danger-800">{errors.general}</p>
          </div>
        )}

        {/* Basic Information */}
        <Card title="Basic Information">
          <div className="space-y-4">
            {/* Patient Selection */}
            <Select
              label="Patient"
              required
              value={formData.patientId}
              onChange={(e) => handleChange('patientId', e.target.value)}
              options={patientOptions}
              placeholder="Select a patient"
              error={!!errors.patientId}
              errorMessage={errors.patientId}
            />

            {/* Medicine Name */}
            <Input
              label="Medicine Name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Aspirin"
              error={!!errors.name}
              errorMessage={errors.name}
            />

            {/* Dosage */}
            <Input
              label="Dosage"
              required
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              placeholder="e.g., 500mg"
              error={!!errors.dosage}
              errorMessage={errors.dosage}
            />

            {/* Category */}
            <Select
              label="Category"
              required
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
              error={!!errors.category}
              errorMessage={errors.category}
            />

            {/* Notes */}
            <FormField
              label="Instructions/Notes"
              helpText="Any special instructions for taking this medicine"
              error={!!errors.notes}
              errorMessage={errors.notes}
            >
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="e.g., Take with food"
                rows="3"
                className="input"
              />
            </FormField>
          </div>
        </Card>

        {/* Schedule */}
        <Card title="Schedule">
          <div className="space-y-4">
            {/* Frequency */}
            <Select
              label="Frequency"
              required
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              options={frequencyOptions}
              placeholder="Select frequency"
              error={!!errors.frequency}
              errorMessage={errors.frequency}
            />

            {/* Timings */}
            <FormField
              label="Dose Times"
              required
              helpText="Specify when to take each dose"
              error={!!errors.timings}
              errorMessage={errors.timings}
            >
              <div className="space-y-2">
                {formData.timings.map((timing, index) => (
                  <div key={index} className="flex gap-2">
                    <TimePicker
                      value={timing}
                      onChange={(e) => handleTimingChange(index, e.target.value)}
                      error={!!errors.timings}
                    />
                    {formData.timings.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => removeTiming(index)}
                        aria-label="Remove timing"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={addTiming}
                >
                  + Add Time
                </Button>
              </div>
            </FormField>

            {/* Start Date */}
            <DatePicker
              label="Start Date"
              required
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              error={!!errors.startDate}
              errorMessage={errors.startDate}
            />

            {/* End Date */}
            <DatePicker
              label="End Date (Optional)"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              min={formData.startDate}
              error={!!errors.endDate}
              errorMessage={errors.endDate}
            />
          </div>
        </Card>

        {/* Inventory & Reminders */}
        <Card title="Inventory & Reminders">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Low Stock Threshold */}
            <Input
              label="Low Stock Alert"
              type="number"
              required
              value={formData.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
              placeholder="Alert threshold"
              min="0"
              helpText="Get notified when stock falls below this number"
              error={!!errors.lowStockThreshold}
              errorMessage={errors.lowStockThreshold}
            />

            {/* Reminder Minutes */}
            <Input
              label="Reminder (minutes before)"
              type="number"
              required
              value={formData.reminderMinutesBefore}
              onChange={(e) => handleChange('reminderMinutesBefore', e.target.value)}
              placeholder="15"
              min="0"
              helpText="How early to remind before dose time"
              error={!!errors.reminderMinutesBefore}
              errorMessage={errors.reminderMinutesBefore}
            />
          </div>
          
          {!isEditMode && (
            <div className="mt-4 bg-info-50 border-l-4 border-info-500 p-3 rounded">
              <p className="text-sm text-info-800">
                💡 <strong>Stock Management:</strong> After creating this medicine, add stock through the Inventory page using the "Refill" button.
              </p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/medicines')}
            fullWidth
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Medicine' : 'Add Medicine'}
          </Button>
        </div>
      </form>

      {/* Duplicate Medicine Dialog */}
      <DuplicateMedicineDialog
        isOpen={!!duplicateDialog}
        onClose={() => {
          setDuplicateDialog(null)
          setIsSubmitting(false)
        }}
        onUseExisting={handleUseExisting}
        onCreateNew={handleCreateNew}
        newMedicine={duplicateDialog?.newMedicine || {}}
        existingMedicines={duplicateDialog?.existingMedicines || []}
      />
    </div>
  )
}

export default AddEditMedicinePage
