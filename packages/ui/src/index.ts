/**
 * @elevanaltd/ui
 *
 * React UI components for EAV Operations Suite.
 * Two-layer architecture: logic in @elevanaltd/shared-lib, presentation here.
 */

// Navigation components
export {
  HierarchicalNavigationSidebar,
  type HierarchicalNavigationSidebarProps,
} from './components/HierarchicalNavigationSidebar';

// Layout components
export {
  Header,
  type HeaderProps,
} from './components/Header';

// Form components
export {
  AutocompleteField,
  type AutocompleteFieldProps,
} from './components/AutocompleteField';

// Contexts
export {
  DropdownProvider,
  useDropdown,
} from './contexts/DropdownContext';

// Re-export shared-lib types for convenience
export type { Project, Video, NavigationContextType } from '@elevanaltd/shared-lib';
export { NavigationProvider, useNavigation } from '@elevanaltd/shared-lib';
