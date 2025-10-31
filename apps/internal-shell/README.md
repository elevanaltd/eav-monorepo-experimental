# EAV Internal Shell

Multi-app container for internal staff with integrated tabs for scripts, scenes, VO, and cam-op production workflow.

## Purpose

The internal shell serves as the main entry point for internal production staff, providing:

- **Unified navigation** between all production apps (Scripts, Scenes, VO, Cam Op)
- **Tab-based workflow** for seamless transitions between phases
- **Shared authentication** across all embedded apps
- **Project context** preservation when switching between apps

## Architecture

```
internal-shell (router/container)
├── /scripts → eav-scripts-web (Script editing)
├── /scenes → eav-scenes-web (Scene planning)
├── /vo → (Voice Over app - coming soon)
└── /cam-op → (Camera Op PWA - coming soon)
```

Each app is a fully independent module that can also be deployed separately.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint code
pnpm lint
```

## Deployment Strategies

### Internal Staff (Single Deployment)
- Build internal-shell with all 4 apps included
- Users access via single URL with tab navigation
- Shared auth across all apps

### Client Deployments (Custom)
- Can be configured to include only relevant apps
- e.g., clients see only scenes + VO for post-production
- Independent builds for different client workflows

### Standalone (Individual Apps)
- Each app (scripts-web, scenes-web, etc.) can be deployed independently
- Useful for specialized roles or external integrations
- Full functionality without shell container

## Adding New Apps

To add a new app to the shell:

1. Add route in `src/App.tsx`:
```tsx
<Route path="/new-app" element={<NewApp />} />
```

2. Add tab in navigation:
```tsx
<Link to="/new-app" className="shell-tab-link">New App</Link>
```

3. Ensure new app exports a root component that can be embedded

## Configuration

See `.env.example` for required environment variables. All apps share the same Supabase configuration.
