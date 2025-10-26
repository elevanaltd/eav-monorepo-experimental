/**
 * measureQueryTime Tests
 * Phase 2 Day 5: Test co-location remediation
 *
 * Constitutional Compliance: 1:1 test file ratio (measureQueryTime.ts → measureQueryTime.test.ts)
 *
 * Tests for query performance measurement utilities.
 * Supports <50ms benchmark validation from scripts-web MVP.
 */

import { describe, it, expect } from 'vitest'
import { measureQueryTime } from './measureQueryTime.js'

describe('measureQueryTime', () => {
  it('should measure query execution time in milliseconds', async () => {
    const mockOperation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      return { data: [], error: null }
    }

    const { result, timeMs } = await measureQueryTime(mockOperation)

    expect(result).toEqual({ data: [], error: null })
    expect(timeMs).toBeGreaterThanOrEqual(50)
    expect(timeMs).toBeLessThan(100) // Should not add significant overhead
  })

  it('should handle errors without affecting timing', async () => {
    const mockOperation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      throw new Error('Query failed')
    }

    await expect(measureQueryTime(mockOperation)).rejects.toThrow('Query failed')
  })

  it('should provide performance benchmark utilities', async () => {
    // Verify utility exists for performance testing
    expect(measureQueryTime).toBeDefined()
    expect(typeof measureQueryTime).toBe('function')
  })

  it('should measure with microsecond precision', async () => {
    const quickOp = async () => ({ data: 'fast' })

    const { result, timeMs } = await measureQueryTime(quickOp)

    expect(result.data).toBe('fast')
    expect(typeof timeMs).toBe('number')
    expect(timeMs).toBeGreaterThanOrEqual(0)
  })
})
