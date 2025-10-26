/**
 * createAuthDelay Tests
 * Phase 2 Day 5: Test co-location remediation
 *
 * Constitutional Compliance: 1:1 test file ratio (createAuthDelay.ts → createAuthDelay.test.ts)
 *
 * Tests for auth delay function to prevent rapid successive authentication calls.
 */

import { describe, it, expect } from 'vitest'
import { createAuthDelay } from './createAuthDelay.js'

describe('createAuthDelay', () => {
  it('should create delay function with configurable minimum interval', async () => {
    const authDelay = createAuthDelay(100) // 100ms minimum

    const start = Date.now()
    await authDelay()
    await authDelay()
    const elapsed = Date.now() - start

    // Second call should wait at least 100ms after first
    // Allow 2ms tolerance for CI timing precision (98-100ms acceptable)
    expect(elapsed).toBeGreaterThanOrEqual(98)
  })

  it('should prevent rapid successive calls', async () => {
    const authDelay = createAuthDelay(50)

    const timings: number[] = []
    timings.push(Date.now())
    await authDelay()

    timings.push(Date.now())
    await authDelay()

    timings.push(Date.now())

    // Each call should be at least 50ms apart
    const gap1 = timings[1] - timings[0]
    const gap2 = timings[2] - timings[1]

    expect(gap1).toBeGreaterThanOrEqual(0) // First call immediate
    // Allow 2ms tolerance for timing precision (49-50ms acceptable)
    expect(gap2).toBeGreaterThanOrEqual(48) // Second call delayed
  })
})
