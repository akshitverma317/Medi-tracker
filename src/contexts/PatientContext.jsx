import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useStorage } from './StorageContext.jsx'
import { generateId } from '../utils/idGenerator.js'
import { validatePatient } from '../utils/validation.js'

const PatientContext = createContext(null)

export const usePatients = () => {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error('usePatients must be used within PatientProvider')
  }
  return context
}

export const PatientProvider = ({ children }) => {
  const { appState, updateState } = useStorage()
  const [selectedPatientId, setSelectedPatientId] = useState(null)

  const patients = useMemo(() => appState?.patients || [], [appState?.patients])

  // Get patient by ID
  const getPatient = useCallback((id) => {
    return patients.find(p => p.id === id) || null
  }, [patients])

  // Get selected patient
  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return null
    return getPatient(selectedPatientId)
  }, [selectedPatientId, getPatient])

  // Add new patient
  const addPatient = useCallback((patientData) => {
    // Validate patient data
    const validation = validatePatient(patientData)
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      }
    }

    const now = new Date().toISOString()
    const newPatient = {
      id: generateId(),
      name: patientData.name.trim(),
      age: patientData.age,
      photo: patientData.photo || null,
      medicalConditions: patientData.medicalConditions || [],
      allergies: patientData.allergies || [],
      caregiverName: patientData.caregiverName.trim(),
      createdAt: now,
      updatedAt: now
    }

    const updatedPatients = [...patients, newPatient]
    updateState({ patients: updatedPatients })

    // Auto-select if this is the first patient
    if (patients.length === 0) {
      setSelectedPatientId(newPatient.id)
    }

    return {
      success: true,
      patient: newPatient
    }
  }, [patients, updateState])

  // Update existing patient
  const updatePatient = useCallback((id, updates) => {
    const existingPatient = getPatient(id)
    if (!existingPatient) {
      return {
        success: false,
        errors: { general: 'Patient not found' }
      }
    }

    // Merge updates with existing data
    const updatedData = {
      ...existingPatient,
      ...updates,
      id: existingPatient.id, // Preserve ID
      createdAt: existingPatient.createdAt, // Preserve creation time
      updatedAt: new Date().toISOString()
    }

    // Validate updated data
    const validation = validatePatient(updatedData)
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      }
    }

    const updatedPatients = patients.map(p =>
      p.id === id ? updatedData : p
    )

    updateState({ patients: updatedPatients })

    return {
      success: true,
      patient: updatedData
    }
  }, [patients, getPatient, updateState])

  // Delete patient
  const deletePatient = useCallback((id) => {
    const patient = getPatient(id)
    if (!patient) {
      return {
        success: false,
        error: 'Patient not found'
      }
    }

    // Remove patient
    const updatedPatients = patients.filter(p => p.id !== id)
    
    // Also remove all medicines assigned to this patient
    const updatedMedicines = (appState?.medicines || []).filter(m => m.patientId !== id)
    
    // Remove all dose records for this patient
    const updatedDoseRecords = (appState?.doseRecords || []).filter(d => d.patientId !== id)
    
    // Remove all refill records for medicines that belonged to this patient
    const medicineIds = (appState?.medicines || [])
      .filter(m => m.patientId === id)
      .map(m => m.id)
    const updatedRefillRecords = (appState?.refillRecords || []).filter(
      r => !medicineIds.includes(r.medicineId)
    )

    updateState({
      patients: updatedPatients,
      medicines: updatedMedicines,
      doseRecords: updatedDoseRecords,
      refillRecords: updatedRefillRecords
    })

    // Clear selection if deleted patient was selected
    if (selectedPatientId === id) {
      setSelectedPatientId(updatedPatients.length > 0 ? updatedPatients[0].id : null)
    }

    return {
      success: true,
      deletedPatient: patient
    }
  }, [patients, appState, getPatient, updateState, selectedPatientId])

  // Select patient
  const selectPatient = useCallback((id) => {
    if (id && !getPatient(id)) {
      return { success: false, error: 'Patient not found' }
    }
    setSelectedPatientId(id)
    return { success: true }
  }, [getPatient])

  const value = {
    patients,
    selectedPatientId,
    selectedPatient,
    getPatient,
    addPatient,
    updatePatient,
    deletePatient,
    selectPatient
  }

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  )
}

export default PatientContext
