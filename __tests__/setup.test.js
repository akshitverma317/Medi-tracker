import { describe, it, expect } from 'vitest'

describe('Project Setup', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true)
  })

  it('should be able to perform basic assertions', () => {
    const value = 42
    expect(value).toBe(42)
    expect(value).toBeGreaterThan(40)
    expect(value).toBeLessThan(50)
  })
})
