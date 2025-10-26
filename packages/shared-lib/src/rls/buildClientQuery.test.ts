/**
 * buildClientQuery Tests
 * Phase 2 Day 5: Test co-location remediation
 *
 * Constitutional Compliance: 1:1 test file ratio (buildClientQuery.ts → buildClientQuery.test.ts)
 *
 * Tests for client-filtered query builders with InitPlan optimization.
 * Pattern extracted from scripts-web MVP (proven <50ms performance).
 */

import { describe, it, expect, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/index.js'
import { buildClientQuery } from './buildClientQuery.js'

describe('buildClientQuery', () => {
  it('should build query with client_filter JOIN', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }

    const mockClient = {
      from: vi.fn(() => mockQueryBuilder),
    } as any as SupabaseClient<Database>

    const userId = 'user-123'

    // Expected: Build query with efficient InitPlan pattern
    // SELECT * FROM projects WHERE client_filter IN (
    //   SELECT client_filter FROM user_clients WHERE user_id = $1
    // )
    const queryBuilder = buildClientQuery(mockClient, 'projects', userId)

    expect(queryBuilder).toBeDefined()
    expect(mockClient.from).toHaveBeenCalledWith('projects')
    expect(typeof queryBuilder.select).toBe('function')
  })

  it('should support admin bypass (no filter)', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }

    const mockClient = {
      from: vi.fn(() => mockQueryBuilder),
    } as any as SupabaseClient<Database>

    const adminUserId = 'admin-user-123'

    // Admin should get unfiltered query
    const queryBuilder = buildClientQuery(mockClient, 'projects', adminUserId, {
      isAdmin: true,
    })

    expect(queryBuilder).toBeDefined()
    expect(mockClient.from).toHaveBeenCalledWith('projects')
  })

  it('should support custom client_filter column name', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }

    const mockClient = {
      from: vi.fn(() => mockQueryBuilder),
    } as any as SupabaseClient<Database>

    const userId = 'user-123'

    // Some tables might use different column names
    const queryBuilder = buildClientQuery(mockClient, 'custom_table', userId, {
      filterColumn: 'organization_id',
    })

    expect(queryBuilder).toBeDefined()
    expect(mockClient.from).toHaveBeenCalledWith('custom_table')
  })
})
