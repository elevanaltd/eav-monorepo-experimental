import { describe, it, expect, assertType } from 'vitest'
import type { Project, Video, NavigationContextType } from './NavigationContext'

describe('NavigationContext Types', () => {
  it('should export Project interface with production fields', () => {
    const project: Project = {
      id: 'test-id',
      title: 'Test Project',
      eav_code: 'EAV-001',
      due_date: '2025-12-31',
      project_phase: 'planning',
    }

    // Verify type structure at compile time
    assertType<Project>(project)

    expect(project.id).toBe('test-id')
    expect(project.title).toBe('Test Project')
    expect(project.eav_code).toBe('EAV-001')
    expect(project.due_date).toBe('2025-12-31')
    expect(project.project_phase).toBe('planning')
  })

  it('should export Video interface with production fields', () => {
    const video: Video = {
      id: 'video-id',
      eav_code: 'EAV-001-01',
      title: 'Test Video',
      main_stream_status: 'complete',
      vo_stream_status: 'in_progress',
    }

    // Verify type structure at compile time
    assertType<Video>(video)

    expect(video.id).toBe('video-id')
    expect(video.eav_code).toBe('EAV-001-01')
    expect(video.title).toBe('Test Video')
    expect(video.main_stream_status).toBe('complete')
    expect(video.vo_stream_status).toBe('in_progress')
  })

  it('should export NavigationContextType with selection state and helpers', () => {
    const mockContext: NavigationContextType = {
      selectedProject: null,
      selectedVideo: null,
      setSelectedProject: () => {},
      setSelectedVideo: () => {},
      clearSelection: () => {},
      isProjectSelected: () => false,
      isVideoSelected: () => false,
    }

    // Verify type structure at compile time
    assertType<NavigationContextType>(mockContext)

    expect(mockContext.selectedProject).toBeNull()
    expect(mockContext.selectedVideo).toBeNull()
    expect(typeof mockContext.setSelectedProject).toBe('function')
    expect(typeof mockContext.setSelectedVideo).toBe('function')
    expect(typeof mockContext.clearSelection).toBe('function')
    expect(typeof mockContext.isProjectSelected).toBe('function')
    expect(typeof mockContext.isVideoSelected).toBe('function')
  })
})
