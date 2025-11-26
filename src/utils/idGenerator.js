/**
 * ID Generator Utility
 * 
 * Generates unique IDs for entities
 */

/**
 * Generate a unique ID
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export default generateId
