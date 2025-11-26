/**
 * AlertService
 * 
 * Smart alerts for drug interactions, allergies, and safety warnings
 */

class AlertService {
  constructor() {
    // Common drug interactions database (simplified)
    this.drugInteractions = {
      'warfarin': ['aspirin', 'ibuprofen', 'naproxen', 'vitamin k'],
      'aspirin': ['warfarin', 'ibuprofen', 'naproxen', 'clopidogrel'],
      'metformin': ['alcohol', 'contrast dye'],
      'lisinopril': ['potassium', 'spironolactone'],
      'levothyroxine': ['calcium', 'iron', 'antacids'],
      'simvastatin': ['grapefruit', 'clarithromycin', 'itraconazole'],
      'amlodipine': ['grapefruit', 'simvastatin'],
      'omeprazole': ['clopidogrel', 'methotrexate'],
      'prednisone': ['nsaids', 'aspirin', 'warfarin'],
      'insulin': ['alcohol', 'beta blockers']
    }

    // Common allergen keywords
    this.allergenKeywords = {
      'penicillin': ['amoxicillin', 'ampicillin', 'penicillin'],
      'sulfa': ['sulfamethoxazole', 'sulfasalazine', 'sulfa'],
      'aspirin': ['aspirin', 'asa', 'acetylsalicylic'],
      'nsaid': ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib'],
      'latex': ['latex'],
      'iodine': ['iodine', 'contrast']
    }
  }

  /**
   * Check for drug interactions
   */
  checkDrugInteractions(newMedicine, existingMedicines) {
    const alerts = []
    const newMedName = newMedicine.name.toLowerCase()

    existingMedicines.forEach(existingMed => {
      const existingMedName = existingMed.name.toLowerCase()

      // Check if new medicine interacts with existing
      Object.keys(this.drugInteractions).forEach(drug => {
        if (newMedName.includes(drug)) {
          this.drugInteractions[drug].forEach(interactingDrug => {
            if (existingMedName.includes(interactingDrug)) {
              alerts.push({
                type: 'drug-interaction',
                severity: 'high',
                title: 'Drug Interaction Warning',
                message: `${newMedicine.name} may interact with ${existingMed.name}`,
                details: `These medications may have interactions. Please consult with a healthcare provider.`,
                medicines: [newMedicine.name, existingMed.name]
              })
            }
          })
        }

        // Check reverse interaction
        if (existingMedName.includes(drug)) {
          this.drugInteractions[drug].forEach(interactingDrug => {
            if (newMedName.includes(interactingDrug)) {
              alerts.push({
                type: 'drug-interaction',
                severity: 'high',
                title: 'Drug Interaction Warning',
                message: `${newMedicine.name} may interact with ${existingMed.name}`,
                details: `These medications may have interactions. Please consult with a healthcare provider.`,
                medicines: [newMedicine.name, existingMed.name]
              })
            }
          })
        }
      })
    })

    // Remove duplicates
    return this.removeDuplicateAlerts(alerts)
  }

  /**
   * Check for allergy conflicts
   */
  checkAllergyConflicts(medicine, patientAllergies) {
    const alerts = []
    const medName = medicine.name.toLowerCase()

    patientAllergies.forEach(allergy => {
      const allergyLower = allergy.toLowerCase()

      // Check each allergen type
      Object.keys(this.allergenKeywords).forEach(allergenType => {
        // Check if patient is allergic to this type
        const isAllergic = this.allergenKeywords[allergenType].some(keyword =>
          allergyLower.includes(keyword)
        )

        if (isAllergic) {
          // Check if medicine contains this allergen
          const containsAllergen = this.allergenKeywords[allergenType].some(keyword =>
            medName.includes(keyword)
          )

          if (containsAllergen) {
            alerts.push({
              type: 'allergy',
              severity: 'critical',
              title: '🚨 ALLERGY ALERT',
              message: `Patient is allergic to ${allergy}`,
              details: `${medicine.name} may contain or be related to ${allergy}. DO NOT ADMINISTER without consulting a doctor.`,
              medicine: medicine.name,
              allergy: allergy
            })
          }
        }
      })

      // Direct name match
      if (medName.includes(allergyLower) || allergyLower.includes(medName)) {
        alerts.push({
          type: 'allergy',
          severity: 'critical',
          title: '🚨 ALLERGY ALERT',
          message: `Patient is allergic to ${allergy}`,
          details: `${medicine.name} matches patient allergy. DO NOT ADMINISTER.`,
          medicine: medicine.name,
          allergy: allergy
        })
      }
    })

    return this.removeDuplicateAlerts(alerts)
  }

  /**
   * Check for duplicate medications
   */
  checkDuplicateMedications(newMedicine, existingMedicines) {
    const alerts = []
    const newMedName = newMedicine.name.toLowerCase()

    existingMedicines.forEach(existingMed => {
      const existingMedName = existingMed.name.toLowerCase()

      // Exact match
      if (newMedName === existingMedName) {
        alerts.push({
          type: 'duplicate',
          severity: 'medium',
          title: 'Duplicate Medication',
          message: `${newMedicine.name} is already in the medication list`,
          details: `This patient is already taking this medication. Adding it again may result in double dosing.`,
          medicine: newMedicine.name
        })
      }

      // Similar name (potential duplicate)
      if (this.areSimilarNames(newMedName, existingMedName)) {
        alerts.push({
          type: 'duplicate',
          severity: 'medium',
          title: 'Similar Medication Found',
          message: `${newMedicine.name} is similar to ${existingMed.name}`,
          details: `These medications have similar names. Please verify this is not a duplicate.`,
          medicines: [newMedicine.name, existingMed.name]
        })
      }
    })

    return alerts
  }

  /**
   * Check for expired medications
   */
  checkExpiredMedications(medicines) {
    const alerts = []
    const today = new Date()

    medicines.forEach(medicine => {
      if (medicine.endDate) {
        const endDate = new Date(medicine.endDate)
        const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry < 0) {
          alerts.push({
            type: 'expired',
            severity: 'high',
            title: 'Expired Medication',
            message: `${medicine.name} has expired`,
            details: `This medication expired ${Math.abs(daysUntilExpiry)} days ago. Please remove or update.`,
            medicine: medicine.name,
            expiredDays: Math.abs(daysUntilExpiry)
          })
        } else if (daysUntilExpiry <= 7) {
          alerts.push({
            type: 'expiring-soon',
            severity: 'medium',
            title: 'Medication Expiring Soon',
            message: `${medicine.name} expires in ${daysUntilExpiry} days`,
            details: `This medication will expire soon. Plan for renewal or discontinuation.`,
            medicine: medicine.name,
            daysRemaining: daysUntilExpiry
          })
        }
      }
    })

    return alerts
  }

  /**
   * Check for critical low stock
   */
  checkCriticalStock(medicines) {
    const alerts = []

    medicines.forEach(medicine => {
      const stock = medicine.stockQuantity || 0
      const minStock = medicine.minStockLevel || 5

      if (stock === 0) {
        alerts.push({
          type: 'out-of-stock',
          severity: 'critical',
          title: 'Out of Stock',
          message: `${medicine.name} is out of stock`,
          details: `No doses remaining. Refill immediately to avoid missed doses.`,
          medicine: medicine.name
        })
      } else if (stock < minStock) {
        alerts.push({
          type: 'low-stock',
          severity: 'high',
          title: 'Low Stock Alert',
          message: `${medicine.name} has only ${stock} doses left`,
          details: `Stock is below minimum level of ${minStock}. Refill soon.`,
          medicine: medicine.name,
          currentStock: stock,
          minStock: minStock
        })
      }
    })

    return alerts
  }

  /**
   * Get all alerts for a patient
   */
  getAllAlerts(patient, medicines, allMedicines) {
    const alerts = []

    // Check each medicine for issues
    medicines.forEach(medicine => {
      // Check allergies
      const allergyAlerts = this.checkAllergyConflicts(medicine, patient.allergies)
      alerts.push(...allergyAlerts)

      // Check drug interactions with other medicines
      const otherMedicines = medicines.filter(m => m.id !== medicine.id)
      const interactionAlerts = this.checkDrugInteractions(medicine, otherMedicines)
      alerts.push(...interactionAlerts)
    })

    // Check for expired medications
    const expiredAlerts = this.checkExpiredMedications(medicines)
    alerts.push(...expiredAlerts)

    // Check for low stock
    const stockAlerts = this.checkCriticalStock(medicines)
    alerts.push(...stockAlerts)

    return this.sortAlertsBySeverity(alerts)
  }

  /**
   * Helper: Check if two medicine names are similar
   */
  areSimilarNames(name1, name2) {
    // Simple similarity check (can be improved with Levenshtein distance)
    if (name1.length < 3 || name2.length < 3) return false

    const substring1 = name1.substring(0, Math.min(5, name1.length))
    const substring2 = name2.substring(0, Math.min(5, name2.length))

    return substring1 === substring2
  }

  /**
   * Helper: Remove duplicate alerts
   */
  removeDuplicateAlerts(alerts) {
    const seen = new Set()
    return alerts.filter(alert => {
      const key = `${alert.type}-${alert.message}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  /**
   * Helper: Sort alerts by severity
   */
  sortAlertsBySeverity(alerts) {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  }
}

// Export singleton instance
const alertService = new AlertService()
export default alertService
