# Q2 GATE 2.3: Vercel Compatibility - CRITICAL FAILURE

**Timestamp:** 2025-10-27 (Phase 0 PoC Validation)
**Test:** Build scripts-web to simulate Vercel deployment
**Status:** 🚨 **STOP-LOSS TRIGGERED** 🚨

---

## Build Command
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/apps/scripts-web
npm run build
```

## Result: ❌ CRITICAL FAILURE - TS2307 ERRORS

**Error Count:** 117 TypeScript errors
**Error Type:** `TS2307: Cannot find module '@tiptap/core' or its corresponding type declarations`

---

## Sample Errors

```
src/components/extensions/CommentHighlightExtension.test.ts(11,24): error TS2307: Cannot find module '@tiptap/core' or its corresponding type declarations.
src/components/extensions/CommentHighlightExtension.ts(16,54): error TS2307: Cannot find module '@tiptap/core' or its corresponding type declarations.
src/components/extensions/CommentHighlightExtension.ts(17,24): error TS2307: Cannot find module '@tiptap/pm/state' or its corresponding type declarations.
src/components/TipTapEditor.tsx(22,51): error TS2307: Cannot find module '@tiptap/pm/model' or its corresponding type declarations.
src/lib/componentExtraction.test.ts(4,24): error TS2307: Cannot find module '@tiptap/pm/schema-basic' or its corresponding type declarations.
src/lib/editor/sanitizeUtils.ts(11,51): error TS2307: Cannot find module '@tiptap/pm/model' or its corresponding type declarations.
```

**Affected Packages:**
- `@tiptap/core` (not in package.json, only transitive)
- `@tiptap/pm/*` (ProseMirror packages, transitive only)

---

## Root Cause Analysis

### 🔍 **pnpm Hoisting + TypeScript moduleResolution**

**Monorepo Configuration:**
- Package Manager: `pnpm` with workspace hoisting
- Package Location: `/../../node_modules/.pnpm/@tiptap+core@2.26.4_@tiptap+pm@2.26.4/node_modules/@tiptap/core`
- TypeScript: `"moduleResolution": "bundler"`
- Installed: ✅ YES (via `npm ls @tiptap/core`)
- Resolved by TypeScript: ❌ NO

**Original Multi-Repo Configuration:**
- Package Manager: `npm`
- Package Location: `node_modules/@tiptap/core`
- TypeScript: `"moduleResolution": "bundler"`
- Installed: ✅ YES
- Resolved by TypeScript: ✅ YES
- TS2307 Errors: **ZERO**

---

## Comparative Verification

### Original Multi-Repo Build
```bash
cd /Volumes/HestAI-Projects/eav-ops/eav-apps/scripts-web
npm run typecheck
```
**Result:** ✅ ZERO TS2307 errors

### Monorepo Build
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/apps/scripts-web
npm run build
```
**Result:** ❌ 117 TS2307 errors

---

## Why This Happens

### pnpm Hoisting Mechanism
```
monorepo-root/
├── node_modules/
│   ├── .pnpm/
│   │   └── @tiptap+core@2.26.4_@tiptap+pm@2.26.4/
│   │       └── node_modules/
│   │           └── @tiptap/core  ← Actual package location
│   └── @tiptap/react → .pnpm/...  ← Symlink to hoisted version
└── apps/scripts-web/
    ├── node_modules/  ← Empty for hoisted dependencies
    └── src/
        └── file.ts  ← import '@tiptap/core' ← TypeScript can't resolve
```

**Problem:**
1. `@tiptap/core` is **not** in scripts-web's package.json (only transitive via `@tiptap/react`)
2. pnpm hoists it to root `.pnpm/` directory with complex path structure
3. TypeScript `moduleResolution: "bundler"` expects packages in local `node_modules/@scope/package`
4. TypeScript cannot traverse pnpm's symlink structure for transitive dependencies

**This is THE failure mode from coordination/lessons-learned/002-MONOREPO-FAILURE-ANALYSIS.md!**

---

## Implications for Vercel

**What This Means for Deployment:**
- Build would fail on Vercel with identical TS2307 errors
- `tsc` step in `npm run build` prevents deployment
- No deployment = no runtime testing = BLOCKER

**Workarounds:**
1. Add all transitive dependencies explicitly to package.json (defeats DRY principle)
2. Change `moduleResolution` to `"node"` (may break other imports)
3. Skip TypeScript during build (`"noEmit": true` already set, but build script runs `tsc`)
4. Use npm instead of pnpm (defeats monorepo hoisting benefits)

**Why Workarounds Are Anti-Patterns:**
- Workaround #1: Maintenance burden (track transitive deps manually)
- Workaround #2: May break Vite/modern tooling assumptions
- Workaround #3: Removes type safety from production builds
- Workaround #4: Defeats entire purpose of pnpm in monorepo

---

## STOP-LOSS RULE TRIGGERED

**Gate 2.3 Rule:** "Single TS2307 error = immediate NO-GO (no retries)"

**Verdict:** ❌ **NO-GO FOR MONOREPO**

**Error Count:** 117 TS2307 errors
**Threshold:** 1 error
**Exceeded By:** 11,600%

---

## Evidence Trail

**Package Installation Proof:**
```bash
$ npm ls @tiptap/core
eav-scripts-web@0.1.0 /Volumes/HestAI-Projects/eav-monorepo-experimental/apps/scripts-web
├─┬ @tiptap/extension-collaboration-cursor@2.26.2 -> ./../../node_modules/.pnpm/@tiptap+extension-collaboration-cursor@2.26.2_@tiptap+core@2.26.4_y-prosemirror@1.3.7/node_modules/@tiptap/extension-collaboration-cursor
│ └─┬ @tiptap/core@2.26.4 -> ./../../node_modules/.pnpm/@tiptap+core@2.26.4_@tiptap+pm@2.26.4/node_modules/@tiptap/core
```
Packages ARE installed, but TypeScript CANNOT resolve them.

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

**Build Script:**
```json
"scripts": {
  "build": "tsc && vite build"  ← tsc fails before Vite runs
}
```

---

## Final Assessment

**Q2: Vercel Compatibility**
- **Status:** ❌ FAILED
- **Reason:** TypeScript cannot resolve pnpm hoisted transitive dependencies
- **Impact:** Build fails before deployment (no runtime testing possible)
- **Severity:** BLOCKER

**Next Steps:**
- HALT Q2 validation (no point testing Q2 Gate 2.4 without successful build)
- Document failure for ADR
- Proceed with Q3-Q5 IF they can run without successful build
- Prepare final NO-GO recommendation

---

## Historical Context

This failure mode was PREDICTED in:
- `coordination/lessons-learned/002-MONOREPO-FAILURE-ANALYSIS.md`
- `coordination/docs/ADR-002-HYBRID-ARCHITECTURE.md`

**Quote from ADR-002:**
> "TypeScript path mapping (`@packages/*`) failed 6x on Vercel serverless runtime"

**Current Evidence:**
- Not using path mapping (`workspace:*` protocol)
- Still failing due to pnpm hoisting + transitive dependency resolution
- Different symptom, same root cause: **module resolution complexity in monorepo**

---

## VERDICT: Q2 GATE 2.3 - ❌ CRITICAL FAILURE

**Stop-Loss Activated:** YES
**Proceed to Vercel Deploy:** NO (build fails locally, no point attempting)
**Monorepo Viability:** ❌ NO-GO (unless workarounds accepted, which violate architectural principles)
