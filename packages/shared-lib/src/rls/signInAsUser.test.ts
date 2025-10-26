/**
 * signInAsUser Tests
 * Phase 2 Day 5: Test co-location remediation
 *
 * Constitutional Compliance: 1:1 test file ratio (signInAsUser.ts → signInAsUser.test.ts)
 *
 * Tests for test user authentication utilities.
 * Supports RLS policy testing by signing in as specific test users.
 */

import { describe, it, expect, vi } from 'vitest'
import { signInAsUser } from './signInAsUser.js'

describe('signInAsUser', () => {
  it('should sign in user and return user ID', async () => {
    const mockUserId = 'user-456'
    const mockClient = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId }, session: {} },
          error: null,
        }),
      },
    } as any

    const userId = await signInAsUser(mockClient, 'test@example.com', 'password123')

    expect(userId).toBe(mockUserId)
    expect(mockClient.auth.signOut).toHaveBeenCalled()
    expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should throw error on failed authentication', async () => {
    const mockClient = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: { message: 'Invalid credentials' },
        }),
      },
    } as any

    await expect(signInAsUser(mockClient, 'test@example.com', 'wrong-password')).rejects.toThrow()
  })
})
