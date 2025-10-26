import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { NavigationProvider, useNavigation } from './NavigationProvider'
import type { Project, Video } from './NavigationContext'

describe('NavigationProvider', () => {
  it('should throw error when useNavigation used outside provider', () => {
    expect(() => {
      renderHook(() => useNavigation())
    }).toThrow('useNavigation must be used within a NavigationProvider')
  })

  it('should initialize with null selection state', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    })

    expect(result.current.selectedProject).toBeNull()
    expect(result.current.selectedVideo).toBeNull()
  })

  it('should set selected project and clear mismatched video', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    })

    const project1: Project = { id: '1', title: 'P1', eav_code: 'P001' }
    const video1: Video = { id: 'v1', eav_code: 'P001', title: 'V1' }
    const project2: Project = { id: '2', title: 'P2', eav_code: 'P002' }

    act(() => {
      result.current.setSelectedVideo(video1, project1)
    })
    expect(result.current.selectedVideo).toBe(video1)

    act(() => {
      result.current.setSelectedProject(project2)
    })
    expect(result.current.selectedProject).toBe(project2)
    expect(result.current.selectedVideo).toBeNull() // Cleared due to eav_code mismatch
  })

  it('should preserve video when project eav_code matches', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    })

    const project: Project = { id: '1', title: 'P1', eav_code: 'P001' }
    const video: Video = { id: 'v1', eav_code: 'P001', title: 'V1' }

    act(() => {
      result.current.setSelectedVideo(video, project)
      result.current.setSelectedProject(project)
    })

    expect(result.current.selectedVideo).toBe(video) // Preserved
  })

  it('should clear all selections', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    })

    const project: Project = { id: '1', title: 'P1', eav_code: 'P001' }

    act(() => {
      result.current.setSelectedProject(project)
      result.current.clearSelection()
    })

    expect(result.current.selectedProject).toBeNull()
    expect(result.current.selectedVideo).toBeNull()
  })

  it('should check project selection by ID', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    })

    const project: Project = { id: '1', title: 'P1', eav_code: 'P001' }

    act(() => {
      result.current.setSelectedProject(project)
    })

    expect(result.current.isProjectSelected('1')).toBe(true)
    expect(result.current.isProjectSelected('2')).toBe(false)
  })

  it('should check video selection by ID', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    })

    const project: Project = { id: '1', title: 'P1', eav_code: 'P001' }
    const video: Video = { id: 'v1', eav_code: 'P001', title: 'V1' }

    act(() => {
      result.current.setSelectedVideo(video, project)
    })

    expect(result.current.isVideoSelected('v1')).toBe(true)
    expect(result.current.isVideoSelected('v2')).toBe(false)
  })
})
