import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'
import * as sharedLib from './index.js'
import type { Project, NavigationContextType, DropdownOption } from './index.js'

describe('Package Infrastructure', () => {
  it('should have src/index.ts entry point', () => {
    const indexPath = join(process.cwd(), 'src', 'index.ts')
    expect(existsSync(indexPath)).toBe(true)
  })
})

describe('Package Barrel Exports', () => {
  describe('Navigation Module', () => {
    it('should export NavigationProvider', () => {
      expect(sharedLib.NavigationProvider).toBeDefined()
      expect(typeof sharedLib.NavigationProvider).toBe('function')
    })

    it('should export useNavigation hook', () => {
      expect(sharedLib.useNavigation).toBeDefined()
      expect(typeof sharedLib.useNavigation).toBe('function')
    })

    it('should export Project type', () => {
      // Type exports are validated at compile time by TypeScript
      // This test verifies the type is accessible through the barrel export
      const mockProject: Project = {
        id: 'test-id',
        title: 'Test Project',
        eav_code: 'EAV001',
        due_date: '2025-12-31',
        project_phase: 'production',
      }
      expect(mockProject).toBeDefined()
    })

    it('should export NavigationContextType interface', () => {
      // Type exports are validated at compile time by TypeScript
      // This test verifies the type is accessible through the barrel export
      const mockContext: NavigationContextType = {
        selectedProject: null,
        selectedVideo: null,
        setSelectedProject: () => {},
        setSelectedVideo: () => {},
        clearSelection: () => {},
        isProjectSelected: () => false,
        isVideoSelected: () => false,
      }
      expect(mockContext).toBeDefined()
    })
  })

  describe('Dropdowns Module', () => {
    it('should export useDropdownOptions hook', () => {
      expect(sharedLib.useDropdownOptions).toBeDefined()
      expect(typeof sharedLib.useDropdownOptions).toBe('function')
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
})
