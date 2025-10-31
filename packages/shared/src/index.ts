/**
 * @elevanaltd/shared - Unified shared library for EAV Operations Suite
 *
 * Consolidated package containing:
 * - Database client and utilities (lib/)
 * - React UI components (components/)
 * - Authentication and RLS helpers
 * - Type definitions
 *
 * Re-exports all modules for easy consumption
 */

// ============================================================================
// Library Exports (lib/)
// ============================================================================

// Client module - Supabase client factory
export * from './lib/client/index.js'

// Types module - Database and API types
export * from './lib/types/index.js'

// Auth module - Authentication utilities
export * from './lib/auth/index.js'

// RLS module - Row Level Security utilities
export * from './lib/rls/index.js'

// Navigation module - Navigation context types and provider
export * from './lib/navigation/NavigationContext.js'
export { NavigationProvider, useNavigation } from './lib/navigation/NavigationProvider.js'

// Dropdowns module - Database-driven dropdown options
export * from './lib/dropdowns/index.js'

// Dropdown context (logic for components)
export { DropdownProvider, useDropdown } from './lib/contexts/DropdownContext.js'

// ============================================================================
// Component Exports (components/)
// ============================================================================

// Navigation components
export {
  HierarchicalNavigationSidebar,
  type HierarchicalNavigationSidebarProps,
} from './components/HierarchicalNavigationSidebar'

// Layout components
export {
  Header,
  type HeaderProps,
} from './components/Header'

// Form components
export {
  AutocompleteField,
  type AutocompleteFieldProps,
} from './components/AutocompleteField'
