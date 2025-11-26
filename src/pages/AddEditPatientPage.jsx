import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePatients } from '../contexts/PatientContext.jsx'
import { validatePatient } from '../utils/validation.js'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Input from '../components/shared/Input.jsx'
import FormField from '../components/shared/FormField.jsx'
import ImageUpload from '../components/shared/ImageUpload.jsx'

/**
 * AddEditPatientPage Component
 * 
 * Form for creating or editing a patient
 */
const AddEditPatientPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPatient, addPatient, updatePatient } = usePatients()

  const isEditMode = !!id
  const existingPatient = isEditMode ? getPatient(id) : null

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    caregiverName: '',
    medicalConditions: '',
    allergies: '',
    photo: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing patient data in edit mode
  useEffect(() => {
    if (existingPatient) {
      setFormData({
        name: existingPatient.name,
        age: existingPatient.age.toString(),
        caregiverName: existingPatient.caregiverName,
        medicalConditions: existingPatient.medicalConditions.join(', '),
        allergies: existingPatient.allergies.join(', '),
        photo: existingPatient.photo || ''
      })
    }
  }, [existingPatient])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepare data for validation
    const patientData = {
      name: formData.name.trim(),
      age: parseInt(formData.age, 10),
      caregiverName: formData.caregiverName.trim(),
      medicalConditions: formData.medicalConditions
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0),
      allergies: formData.allergies
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0),
      photo: formData.photo.trim() || undefined
    }

    // Validate
    const validation = validatePatient(patientData)
    
    if (!validation.valid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    // Submit
    let result
    if (isEditMode) {
      result = updatePatient(id, patientData)
    } else {
      result = addPatient(patientData)
    }

    setIsSubmitting(false)

    if (result.success) {
      navigate('/patients')
    } else {
      setErrors(result.errors || { general: 'Failed to save patient' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          <h2 className="text-3xl font-bold text-neutral-800">
            {isEditMode ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <p className="text-neutral-600 mt-1">
            {isEditMode ? 'Update patient information' : 'Enter patient details'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-danger-50 border-l-4 border-danger-500 p-4">
              <p className="text-danger-800">{errors.general}</p>
            </div>
          )}

          {/* Name */}
          <Input
            label="Patient Name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter patient name"
            error={!!errors.name}
            errorMessage={errors.name}
          />

          {/* Age */}
          <Input
            label="Age"
            type="number"
            required
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="Enter age"
            min="0"
            max="150"
            error={!!errors.age}
            errorMessage={errors.age}
          />

          {/* Caregiver Name */}
          <Input
            label="Caregiver Name"
            required
            value={formData.caregiverName}
            onChange={(e) => handleChange('caregiverName', e.target.value)}
            placeholder="Enter caregiver name"
            error={!!errors.caregiverName}
            errorMessage={errors.caregiverName}
          />

          {/* Medical Conditions */}
          <FormField
            label="Medical Conditions"
            helpText="Separate multiple conditions with commas"
            error={!!errors.medicalConditions}
            errorMessage={errors.medicalConditions}
          >
            <textarea
              value={formData.medicalConditions}
              onChange={(e) => handleChange('medicalConditions', e.target.value)}
              placeholder="e.g., Diabetes, Hypertension"
              rows="3"
              className={`input ${errors.medicalConditions ? 'input-error' : ''}`}
            />
          </FormField>

          {/* Allergies */}
          <FormField
            label="Allergies"
            helpText="Separate multiple allergies with commas"
            error={!!errors.allergies}
            errorMessage={errors.allergies}
          >
            <textarea
              value={formData.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              placeholder="e.g., Penicillin, Peanuts"
              rows="3"
              className={`input ${errors.allergies ? 'input-error' : ''}`}
            />
          </FormField>

          {/* Photo Upload (Optional) */}
          <ImageUpload
            label="Patient Photo (Optional)"
            value={formData.photo}
            onChange={(value) => handleChange('photo', value)}
            error={!!errors.photo}
            errorMessage={errors.photo}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/patients')}
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
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Patient' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddEditPatientPage
