import { describe, it, expect } from 'vitest'
import * as dropdownsModule from './index.js'
import type { DropdownOption } from './index.js'

describe('Dropdowns Module Barrel Exports', () => {
  it('should export useDropdownOptions hook', () => {
    expect(dropdownsModule.useDropdownOptions).toBeDefined()
    expect(typeof dropdownsModule.useDropdownOptions).toBe('function')
  })

  it('should export DropdownOption type', () => {
    // Type exports are validated at compile time by TypeScript
    // This test verifies the type is accessible through the barrel export
    const mockOption: DropdownOption = {
      id: 'test-id',
      field_name: 'shot_type',
      option_value: 'WS',
      option_label: 'Wide Shot',
      sort_order: 1,
      created_at: '2025-01-01',
    }
    expect(mockOption).toBeDefined()
  })
})
