# Vercel Monorepo Deployment Guide

## Overview

This monorepo deploys **4 independent apps** to separate Vercel projects, all from a single GitHub repository.

## Deployment Architecture

```
GitHub Repo: elevanaltd/eav-monorepo-experimental
    ↓
    ├─→ Vercel Project 1: scripts.eav-internal.com (apps/scripts-web)
    ├─→ Vercel Project 2: scenes.eav-internal.com (apps/scenes-web)
    ├─→ Vercel Project 3: vo.eav-internal.com (apps/vo-web)
    └─→ Vercel Project 4: cam-op.eav-internal.com (apps/cam-op-pwa)
```

## Setup Instructions

### For Each App

1. **Go to Vercel Dashboard** → "Add New Project"
2. **Import Git Repository**: `elevanaltd/eav-monorepo-experimental`
3. **Configure Project Settings**:

#### Scripts Web
```
Project Name: eav-scripts-web
Root Directory: apps/scripts-web
Framework Preset: Vite
Build Command: cd ../.. && pnpm turbo run build --filter=eav-scripts-web
Install Command: cd ../.. && corepack enable && pnpm install
Output Directory: dist
Node Version: 18.x or 20.x
```

**Important:** The `installCommand` MUST run from monorepo root (`cd ../..`) to install workspace packages including `@elevanaltd/shared`.

**Environment Variables** (Vercel Dashboard → Settings → Environment Variables):
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_SMARTSUITE_API_KEY=<your-smartsuite-api-key>
VITE_SMARTSUITE_WORKSPACE_ID=s3qnmox1
VITE_SMARTSUITE_PROJECTS_TABLE=68a8ff5237fde0bf797c05b3
VITE_SMARTSUITE_VIDEOS_TABLE=68b2437a8f1755b055e0a124
```

#### Scenes Web
```
Project Name: eav-scenes-web
Root Directory: apps/scenes-web
Framework Preset: Vite
Build Command: cd ../.. && pnpm turbo run build --filter=eav-scenes-web
Install Command: cd ../.. && corepack enable && pnpm install
Output Directory: dist
Node Version: 18.x or 20.x
```

**Environment Variables**:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

#### VO Web (Coming Soon)
```
Project Name: eav-vo-web
Root Directory: apps/vo-web
Framework Preset: Vite
Build Command: cd ../.. && pnpm turbo run build --filter=eav-vo-web
Install Command: cd ../.. && corepack enable && pnpm install
Output Directory: dist
Node Version: 18.x or 20.x
```

#### Camera Op PWA (Coming Soon)
```
Project Name: eav-cam-op-pwa
Root Directory: apps/cam-op-pwa
Framework Preset: Vite
Build Command: cd ../.. && pnpm turbo run build --filter=eav-cam-op-pwa
Install Command: cd ../.. && corepack enable && pnpm install
Output Directory: dist
Node Version: 18.x or 20.x
```

## How It Works

### Monorepo Build Process

1. **Install Phase**: Vercel runs `pnpm install` at root → installs all workspace packages
2. **Build Phase**:
   - Turborepo identifies dependencies (`@elevanaltd/shared`)
   - Builds shared package first
   - Builds target app with cached shared package
   - Only rebuilds what changed (smart caching)
3. **Deploy Phase**: Only the app's `dist/` directory is deployed

### Independent Deployments

Each app deploys independently:
- ✅ Push to `main` branch → Triggers deployment for ALL apps with changes
- ✅ Changes to `apps/scripts-web/` → Only rebuilds scripts-web
- ✅ Changes to `packages/shared/` → Rebuilds all apps using it
- ✅ Preview deployments work per-app for PRs

### Shared Package Handling

The `@elevanaltd/shared` package is:
- Built once during the build process
- Bundled into each app's deployment
- No runtime dependency on the monorepo structure
- Each app is fully self-contained after build

## Deployment URLs

### Production
- Scripts: https://scripts.eav-internal.com (or eav-scripts-web.vercel.app)
- Scenes: https://scenes.eav-internal.com (or eav-scenes-web.vercel.app)
- VO: https://vo.eav-internal.com (or eav-vo-web.vercel.app)
- Camera Op: https://cam-op.eav-internal.com (or eav-cam-op-pwa.vercel.app)

### Preview Deployments
Each PR gets preview URLs:
- `eav-scripts-web-git-[branch]-[team].vercel.app`
- `eav-scenes-web-git-[branch]-[team].vercel.app`

## Custom Domains

To add custom domains:

1. **Vercel Dashboard** → Project → Settings → Domains
2. **Add Domain**: `scripts.eav-internal.com`
3. **DNS Configuration** (at your DNS provider):
   ```
   Type: CNAME
   Name: scripts
   Value: cname.vercel-dns.com
   ```
4. Repeat for each app

## Troubleshooting

### Build fails with "Cannot find module '@elevanaltd/shared'"

**Problem:** Vercel can't find workspace packages when building from `apps/*/` root directory.

**Solution:** Ensure your `vercel.json` has BOTH commands running from monorepo root:

```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=<app-name>",
  "installCommand": "cd ../.. && corepack enable && pnpm install",
  "outputDirectory": "dist"
}
```

**Why this works:**
- `cd ../..` moves from `apps/scenes-web/` → monorepo root
- `pnpm install` at root installs ALL workspace packages
- `@elevanaltd/shared` gets linked into node_modules
- Turborepo builds shared package first, then your app

**Common mistake:** Only setting `buildCommand` without `installCommand` - install MUST also run from root!

---

### Build fails with "Cannot find package"
- Check that `pnpm-workspace.yaml` includes all packages
- Verify `turbo.json` has correct dependency graph
- Run `pnpm install` locally to test

### Shared package changes not reflected
- Clear Turborepo cache: Vercel → Settings → Clear Cache
- Check `turbo.json` has `"dependsOn": ["^build"]` in build pipeline

### Environment variables not working
- Ensure all VITE_ prefixed variables are set in Vercel dashboard
- Redeploy after adding variables (automatic env var reload)

### TypeScript errors about implicit 'any' types
- These are usually secondary errors caused by missing shared package
- Fix the "Cannot find module" error first
- TypeScript will resolve once packages are found

## Vercel Configuration Files

- **Root `vercel.json`**: Global settings for monorepo
- **Per-app `vercel.json`**: App-specific settings (rewrites, functions, etc.)

## CI/CD Best Practices

1. **Branch Protection**: Require CI checks before merge
2. **Preview Deployments**: Test changes in isolated environments
3. **Environment Parity**: Keep dev/staging/prod env vars in sync
4. **Deployment Monitoring**: Set up Vercel alerts for failed deployments

## Further Reading

- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
