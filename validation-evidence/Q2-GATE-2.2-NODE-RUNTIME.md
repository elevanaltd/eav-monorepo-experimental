# Q2 GATE 2.2: Node.js Runtime Simulation

**Timestamp:** 2025-10-27 (Phase 0 PoC Validation)
**Test:** Workspace package import resolution in Node.js runtime (simulates Vercel serverless)

---

## Test Command
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental
node --input-type=module -e "import('@packages/shared-lib').then(m => console.log('SUCCESS:', Object.keys(m).slice(0,5))).catch(e => console.error('FAILURE:', e.message))"
```

## Result: ⚠️ FAILURE (With Workaround Available)

**Output:**
```
FAILURE: Cannot find package '@packages/shared-lib' imported from /Volumes/HestAI-Projects/eav-monorepo-experimental/[eval1]
```

**Root Cause:**
- Node.js runtime doesn't understand `workspace:*` protocol
- `@packages/shared-lib` is a pnpm workspace reference (works in dev, fails at runtime)
- This simulates exactly what Vercel serverless functions would experience

---

## Workaround Validation

**Direct dist import test:**
```bash
node --input-type=module -e "import('./packages/shared-lib/dist/index.js').then(m => console.log('SUCCESS:', Object.keys(m).slice(0,5))).catch(e => console.error('FAILURE:', e.message))"
```

**Result:** ✅ SUCCESS
```
SUCCESS: [
  'NavigationProvider',
  'buildClientQuery',
  'createAuthDelay',
  'createBrowserClient',
  'getSession'
]
```

---

## Critical Findings

### 🔴 Blocker for API Functions
- **Current State:** API functions exist but don't import `@packages/shared-lib` yet
  - `apps/scripts-web/api/sync-manual.ts`
  - `apps/scripts-web/api/smartsuite/[...path].ts`
  - `apps/scripts-web/api/webhook-smartsuite.ts`
- **Future Risk:** Any API function importing `@packages/shared-lib` would fail at runtime
- **Workaround Required:** Build-time bundling or relative path imports

### ✅ Client Code Safe (Vite Bundling)
- Vite bundles workspace dependencies for browser code by default
- Frontend imports work correctly (confirmed by Q1 success)

---

## Implications for Q2 Gate 2.3 (Vercel Deploy)

**Expected Behavior:**
- **Client code:** Should work (Vite bundles workspace deps)
- **API functions:** Would fail if they import `@packages/shared-lib`
- **Current scripts-web:** Safe (no workspace imports in API functions)

**Risk Assessment:**
- **LOW RISK for current codebase** (API functions don't use shared-lib)
- **HIGH RISK for future development** (anti-pattern: forces duplication or relative imports)

---

## Comparison to Multi-Repo (Published Package)

**Multi-Repo Pattern:**
```json
"dependencies": {
  "@elevanaltd/shared-lib": "^0.2.0"  // Published to npm registry
}
```
- Node.js resolves via node_modules
- Works in all environments (dev, prod, serverless)

**Monorepo Workspace Pattern:**
```json
"dependencies": {
  "@packages/shared-lib": "workspace:*"  // pnpm workspace protocol
}
```
- Development: Works via symlinks
- Production: Requires build-time bundling or fails

---

## VERDICT: ⚠️ CONDITIONAL PASS

**Gate 2.2 Status:** PASS with caveats
- Current codebase works (no workspace imports in API functions)
- Future development constrained (cannot use shared-lib in API functions without bundling)
- Architectural anti-pattern (defeats purpose of shared library for server code)

**Proceed to Gate 2.3:** YES
**Risk Level:** MEDIUM (conditional on API function usage patterns)
