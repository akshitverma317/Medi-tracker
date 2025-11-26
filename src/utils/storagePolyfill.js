/**
 * Storage Polyfill
 * 
 * Creates window.storage API using localStorage as the underlying implementation.
 * This provides a consistent API while using browser's localStorage.
 */

/**
 * Initialize window.storage polyfill
 */
export const initializeStoragePolyfill = () => {
  if (typeof window === 'undefined') {
    return
  }

  // If window.storage doesn't exist, create it using localStorage
  if (!window.storage) {
    try {
      // Test if localStorage is available
      const testKey = '__test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)

      // Create window.storage as a wrapper around localStorage
      window.storage = {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
        get length() {
          return localStorage.length
        },
        key: (index) => localStorage.key(index)
      }

      console.log('window.storage initialized using localStorage')
    } catch (error) {
      console.error('Failed to initialize storage polyfill:', error)
      
      // Create in-memory fallback if localStorage is not available
      const memoryStorage = {}
      
      window.storage = {
        getItem: (key) => memoryStorage[key] || null,
        setItem: (key, value) => {
          memoryStorage[key] = String(value)
        },
        removeItem: (key) => {
          delete memoryStorage[key]
        },
        clear: () => {
          Object.keys(memoryStorage).forEach(key => delete memoryStorage[key])
        },
        get length() {
          return Object.keys(memoryStorage).length
        },
        key: (index) => {
          const keys = Object.keys(memoryStorage)
          return keys[index] || null
        }
      }

      console.warn('window.storage initialized with in-memory fallback (data will not persist)')
    }
  }
}

export default initializeStoragePolyfill
