# @elevanaltd/ui

React UI components for EAV Operations Suite.

**Architecture:** Two-layer pattern with `@elevanaltd/shared-lib` (logic) and `@elevanaltd/ui` (presentation).

## Status

✅ **PUBLISHED** - v0.4.0 available on GitHub Packages

**Latest Version**: `0.4.0`
**Package Registry**: https://github.com/elevanaltd/eav-ui/pkgs/npm/ui
**Components**: Header, HierarchicalNavigationSidebar, AutocompleteField
**Contexts**: DropdownProvider

## Installation

```bash
npm install @elevanaltd/ui @elevanaltd/shared-lib
```

**Authentication Required**: Configure GitHub Packages access in `.npmrc`:

```bash
# Project .npmrc or ~/.npmrc
@elevanaltd:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Create a GitHub Personal Access Token with `read:packages` scope at https://github.com/settings/tokens

## Usage

### Basic Integration

```tsx
import { NavigationProvider } from '@elevanaltd/shared-lib';
import { HierarchicalNavigationSidebar } from '@elevanaltd/ui';
import '@elevanaltd/ui/dist/index.css'; // ⚠️ REQUIRED: Import styles

function App() {
  return (
    <NavigationProvider>
      <HierarchicalNavigationSidebar
        projects={projects}
        videos={videos}
        loading={loading}
        onProjectExpand={handleExpand}
      />
    </NavigationProvider>
  );
}
```

**Important:** The CSS import is required for navigation styling to work correctly.

### Header Component

Shared header with app branding, save status, and user controls.

```tsx
import { Header } from '@elevanaltd/ui';

function App() {
  const { user, logout } = useAuth();
  const [lastSaved, setLastSaved] = useState<Date>();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Header
        title="Script Editor"
        userEmail={user?.email}
        lastSaved={lastSaved}
        onSettings={() => setShowSettings(true)}
      />
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)}>
          {/* App-specific settings */}
          <button onClick={logout}>Logout</button>
        </SettingsModal>
      )}
      <main style={{ paddingTop: '64px' }}>
        {/* App content */}
      </main>
    </>
  );
}
```

**Props:**
- `title` (string) - App name displayed in header
- `userEmail` (string, optional) - User email from auth context
- `lastSaved` (Date, optional) - Timestamp for save status display
- `onSettings` (() => void) - Callback when settings button clicked

**Features:**
- Fixed positioning with 64px height (add `paddingTop: '64px'` to content)
- Responsive: Hides save status on mobile, always shows settings button
- Time formatting: "Saved 5s ago", "Saved 3m ago", "Saved 2h ago", or full date
- Framework-agnostic: Pass user data as props, doesn't manage auth internally

### AutocompleteField Component

Accessible autocomplete dropdown with inline "Other" support.

```tsx
import { AutocompleteField, DropdownProvider } from '@elevanaltd/ui'
import { useDropdownOptions } from '@elevanaltd/shared-lib'
import { supabase } from './lib/supabase'
import '@elevanaltd/ui/dist/index.css'

function App() {
  const [value, setValue] = useState('')
  const { data: options } = useDropdownOptions('shot_type', supabase)

  return (
    <DropdownProvider>
      <AutocompleteField
        value={value}
        onChange={setValue}
        options={options || []}
        allowOther={true}
        showOtherText={true}
      />
    </DropdownProvider>
  )
}
```

**Features:**
- ✅ WAI-ARIA combobox pattern (WCAG 2.1.1 compliant)
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Inline "Other" field with auto-save on blur
- ✅ Position-aware (updates on scroll/resize)
- ✅ Screen reader accessible
- ✅ SSR-safe (uses React.useId for deterministic IDs)
- ✅ Production-ready (validated by critical-engineer)

**Props:**
- `value: string` - Current selected value
- `onChange: (value: string) => void` - Value change handler
- `options: string[]` - Array of dropdown options
- `allowOther: boolean` - Enable "Other" option
- `showOtherText: boolean` - Show custom text input for "Other"

### DropdownContext

Context provider for managing single-dropdown-open behavior across application.

```tsx
import { DropdownProvider } from '@elevanaltd/ui'

function App() {
  return (
    <DropdownProvider>
      {/* Only one dropdown can be open at a time */}
      <AutocompleteField {...props1} />
      <AutocompleteField {...props2} />
    </DropdownProvider>
  )
}
```

## App-Specific Filtering Pattern

`HierarchicalNavigationSidebar` is a **generic presentation component**. It renders whatever data it receives without applying business rules.

**Apps should filter projects/videos BEFORE passing to the component:**

```tsx
// scripts-web - Filter by script authoring state
function ScriptsNavigationContainer() {
  const { projects, videos, loading } = useNavigationData();

  // APP-SPECIFIC: Show projects needing script work
  const scriptProjects = projects.filter(p =>
    p.script_status !== 'complete'
  );

  return (
    <NavigationProvider>
      <HierarchicalNavigationSidebar
        projects={scriptProjects}  // Pre-filtered data
        videos={videos}
        loading={loading}
        onProjectExpand={handleExpand}
      />
    </NavigationProvider>
  );
}

// vo-web - Filter by VO production state
function VONavigationContainer() {
  const { projects, videos, loading } = useNavigationData();

  // DIFFERENT FILTERING: Show projects needing VO work
  const voProjects = projects.filter(p =>
    p.vo_stream_status !== 'ready'
  );

  return (
    <NavigationProvider>
      <HierarchicalNavigationSidebar
        projects={voProjects}      // Different business logic
        videos={videos}
        loading={loading}
        onProjectExpand={handleExpand}
      />
    </NavigationProvider>
  );
}
```

**Why This Pattern:**
- **Separation of Concerns:** UI package handles presentation, apps handle business logic
- **Reusability:** Same component across 8 apps with different filtering rules
- **Maintainability:** Change UI once, all apps inherit; change filtering per app without coupling

**Examples by App:**
- **scripts-web:** Filter by `script_status !== 'complete'` (show projects needing scripts)
- **vo-web:** Filter by `vo_stream_status !== 'ready'` (show projects needing VO)
- **scenes-web:** Filter by scene planning readiness
- **edit-web:** Filter by edit readiness
- **cam-op-pwa:** Filter by filming schedule
- **data-entry-web:** Filter by metadata completeness

## Development

```bash
npm run dev          # Watch mode
npm run build        # Production build
npm run test         # Run tests
npm run validate     # Lint + typecheck + test
```
