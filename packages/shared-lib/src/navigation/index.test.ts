/**
 * Navigation Module Barrel Export Tests
 * Quest A: Task A3 - GREEN phase
 *
 * Validates that navigation barrel export re-exports all types and components.
 */

import { describe, it, expect } from 'vitest'
import * as navigationModule from './index.js'

describe('Navigation Module Barrel', () => {
  it('should export NavigationProvider', () => {
    expect(navigationModule.NavigationProvider).toBeDefined()
    expect(typeof navigationModule.NavigationProvider).toBe('function')
  })

  it('should export useNavigation hook', () => {
    expect(navigationModule.useNavigation).toBeDefined()
    expect(typeof navigationModule.useNavigation).toBe('function')
  })

  it('should have all expected exports', () => {
    const expectedExports = ['NavigationProvider', 'useNavigation']
    expectedExports.forEach((exportName) => {
      expect(navigationModule).toHaveProperty(exportName)
    })
  })
})
