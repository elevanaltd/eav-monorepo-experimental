/**
 * Types Module Tests
 * Phase 2 Day 2: Supabase-generated database types
 *
 * Constitutional Principle: TDD::MANDATORY
 * NOTE: TypeScript types are compile-time only, so we test:
 * 1. Module compiles without errors (TypeScript validation)
 * 2. Type helpers work correctly (compile-time check via tsc)
 * 3. Generated types file structure (file system validation)
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('Types Module', () => {
  describe('Generated types file structure', () => {
    it('should have database.types.ts file generated from Supabase', () => {
      const typesPath = join(process.cwd(), 'src/types/database.types.ts')
      expect(existsSync(typesPath)).toBe(true)
    })

    it('should export Database type in database.types.ts', () => {
      const typesPath = join(process.cwd(), 'src/types/database.types.ts')
      const content = readFileSync(typesPath, 'utf-8')

      expect(content).toContain('export type Database')
      expect(content).toContain('public:')
      expect(content).toContain('Tables:')
    })

    it('should have scripts table type definition', () => {
      const typesPath = join(process.cwd(), 'src/types/database.types.ts')
      const content = readFileSync(typesPath, 'utf-8')

      expect(content).toContain('scripts:')
    })

    it('should have components table type definition', () => {
      const typesPath = join(process.cwd(), 'src/types/database.types.ts')
      const content = readFileSync(typesPath, 'utf-8')

      expect(content).toContain('components:')
    })

    it('should have user_role enum definition', () => {
      const typesPath = join(process.cwd(), 'src/types/database.types.ts')
      const content = readFileSync(typesPath, 'utf-8')

      expect(content).toContain('user_role:')
    })
  })

  describe('Barrel export structure', () => {
    it('should have index.ts that re-exports Database type', () => {
      const indexPath = join(process.cwd(), 'src/types/index.ts')
      const content = readFileSync(indexPath, 'utf-8')

      expect(content).toContain('export type { Database')
      expect(content).toContain("from './database.types.js'")
    })

    it('should export type helper utilities', () => {
      const indexPath = join(process.cwd(), 'src/types/index.ts')
      const content = readFileSync(indexPath, 'utf-8')

      expect(content).toContain('export type Tables')
      expect(content).toContain('export type Enums')
      expect(content).toContain('export type Inserts')
      expect(content).toContain('export type Updates')
    })
  })
})
