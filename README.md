# EAV Monorepo Experimental - Git Worktrees Testing

**⚠️ POC STATUS: VALIDATION COMPLETE - NOT PRODUCTION ✅**

**Date:** November 1, 2025 (Updated)
**Status:** All technical gates passed (Q1-Q8 validated) + Vercel deployment proven
**Purpose:** Prove monorepo model works - this is a POC, not production code
**Decision:** PROCEED TO HUB-AND-SPOKE PHASE 0

---

## 🎯 POC Validation Complete

This experimental repository has **successfully validated** the monorepo technical feasibility:

✅ **Q1: Schema Access** - RLS policies working
✅ **Q2: Vercel Deployment** - 324ms cold start, production-ready
✅ **Q3: Deployment Independence** - Zero blast radius confirmed
✅ **Q4: CI Efficiency** - 42-58% faster parallel builds
✅ **Q5: CI Optimization** - 82% speedup on cache hits
✅ **Q6: CI Selective Execution** - Affected detection works (no 25-min CI nightmare)
✅ **Q7: Vercel Monorepo Deployment** - Independent multi-project model validated (Oct 31)
✅ **Q8: Architectural Correctness** - Removed internal-shell, confirmed shared library pattern (Oct 31)
✅ **Q9: Vercel Deployment Working** - POC deployed successfully, all issues documented (Nov 1)

**All validation evidence:** `/Volumes/HestAI-Projects/eav-ops/coordination/poc-phase-0/`

---

## 🚧 Next Steps: Hub-and-Spoke Phase 0 (Safeguards)

**⚠️ IMPORTANT: This is a POC, NOT production code**

This POC successfully proved the monorepo deployment model works. The deployment at https://eav-monorepo-experimental-scenes-we.vercel.app/ is for **validation purposes only**.

**Next phase:** Build Hub-and-Spoke safeguards, THEN migrate production apps to monorepo.

**Production migration blocked until Hub-and-Spoke Phase 0 complete:**

1. **Phase 0.1: Reset Automation** (3-4 days)
   - Database reset protocols for local + preview environments
   - Deliverable: `@elevanaltd/shared-lib@0.2.1` with reset protocols

2. **Phase 0.2: Factory Framework** (3-4 days)
   - Namespaced test data factories for all apps
   - Deliverable: `@elevanaltd/shared-lib@0.3.0` with factory framework

3. **Phase 0.3: RLS Contracts** (2-3 days)
   - Contract testing for shared tables (projects, videos, script_components)
   - Deliverable: CI blocks violating migrations

4. **Phase 0.4: Guild Charter** (1-2 days)
   - Platform Guild governance for schema evolution
   - Deliverable: `supabase/GOVERNANCE.md` + RFC template

**Timeline:** 2-4 weeks before production monorepo migration

**Documentation:** `/Volumes/HestAI-Projects/eav-ops/coordination/workflow-docs/hub-and-spoke/`

---

## 📋 What This POC Proved

**EXPERIMENTAL REPOSITORY FOR TESTING PURPOSES ONLY**

This repository validated monorepo technical feasibility for the EAV Operations Suite. It contains actual code from the production system but is configured for testing the **developer experience** with git worktrees, Turborepo, and Vercel deployment.

### Key Validations (Oct 30-31, 2025)

**Technical Gates (Q1-Q6):**
- Schema access with RLS policies ✅
- Vercel deployment performance (324ms cold start) ✅
- Zero blast radius for independent deployments ✅
- CI build parallelization (42-58% faster) ✅
- Turborepo cache optimization (82% speedup) ✅
- Affected detection preventing 25-min CI nightmare ✅

**Architectural Validations (Q7-Q8):**
- **Vercel Monorepo Model**: Validated deploying 4 independent apps from one repo to separate Vercel projects ✅
- **Shared Library Pattern**: Confirmed `@elevanaltd/shared` as correct architecture (not app-to-app imports) ✅
- **Independent Deployment**: Each app deploys to its own domain with bundled shared code ✅
- **Removed Anti-Pattern**: Deleted `internal-shell` (embedded routing violated independent deployment) ✅

**Documentation:**
- Complete deployment guide: [`VERCEL-DEPLOYMENT.md`](./VERCEL-DEPLOYMENT.md)
- All validation evidence: `/Volumes/HestAI-Projects/eav-ops/coordination/poc-phase-0/`

## Purpose

Test how git worktrees work with:
- Multiple feature branches being worked on simultaneously
- GitHub Desktop visualization and workflow
- Terminal navigation between worktrees
- Commit and branch management across worktrees

## Repository Structure

```
/Volumes/HestAI-Projects/eav-monorepo-experimental/
├── apps/
│   ├── scripts-web/          (collaborative script editing)
│   ├── scenes-web/           (scene planning & shot lists)
│   ├── vo-web/               (voice over generation)
│   └── cam-op-pwa/           (camera operator workflow)
├── packages/
│   ├── shared/               (shared library - utilities, components, types)
│   ├── types/                (shared TypeScript definitions)
│   └── schema/               (database schema types)
├── supabase/
│   ├── migrations/           (database migrations)
│   └── seed.sql              (test data)
└── worktrees/                (git worktrees - each is a full checkout)
    ├── scripts-web/          → feature/scripts-app-test
    ├── scenes-web/           → feature/scenes-app-test
    └── shared-lib/           → feature/shared-lib-test
```

## Deployment Architecture

**Each app deploys independently to its own Vercel project:**

```
Repository: elevanaltd/eav-monorepo-experimental
    ↓
    ├─→ scripts.eav-internal.com (apps/scripts-web)
    ├─→ scenes.eav-internal.com (apps/scenes-web)
    ├─→ vo.eav-internal.com (apps/vo-web)
    └─→ cam-op.eav-internal.com (apps/cam-op-pwa)
```

**See [`VERCEL-DEPLOYMENT.md`](./VERCEL-DEPLOYMENT.md) for complete deployment instructions.**

## Git Worktrees Explained

**Traditional Workflow:**
- One working directory = one branch at a time
- Must stash or commit before switching branches
- Can't work on multiple features simultaneously in same repo

**Git Worktrees Workflow:**
- Multiple working directories = multiple branches simultaneously
- Each worktree is a full checkout of the repo on a different branch
- Work on feature A in `worktrees/scripts-web/` while feature B is in `worktrees/scenes-web/`
- All worktrees share the same `.git` directory (efficient storage)

## Testing Instructions

### 1. Verify Worktrees are Set Up

```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental
git worktree list
```

You should see:
```
/Volumes/.../eav-monorepo-experimental                        [master]
/Volumes/.../eav-monorepo-experimental/worktrees/scenes-web   [feature/scenes-app-test]
/Volumes/.../eav-monorepo-experimental/worktrees/scripts-web  [feature/scripts-app-test]
/Volumes/.../eav-monorepo-experimental/worktrees/shared-lib   [feature/shared-lib-test]
```

### 2. Navigate to Each Worktree

Each worktree is a complete, independent working directory:

```bash
# Main repo (master branch)
cd /Volumes/HestAI-Projects/eav-monorepo-experimental

# Scripts app worktree (feature/scripts-app-test branch)
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scripts-web

# Scenes app worktree (feature/scenes-app-test branch)
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scenes-web

# Shared lib worktree (feature/shared-lib-test branch)
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/shared-lib
```

### 3. Test Git Operations in Each Worktree

Try these commands in each worktree directory:

```bash
# Check which branch you're on
git branch --show-current

# Check status
git status

# Make a test change
echo "// Test change from worktree" >> README.md

# Stage and commit
git add README.md
git commit -m "test: verify worktree workflow"

# View log
git log --oneline -5
```

### 4. Connect with GitHub Desktop

**Step-by-step:**

1. **Open GitHub Desktop**
2. **Add the main repository:**
   - File → Add Local Repository
   - Choose: `/Volumes/HestAI-Projects/eav-monorepo-experimental`
   - This adds the main repo (master branch)

3. **View branches in GitHub Desktop:**
   - Click "Current Branch" dropdown
   - You should see all branches:
     - master
     - feature/scripts-app-test
     - feature/scenes-app-test
     - feature/shared-lib-test

4. **View changes across all worktrees:**
   - GitHub Desktop shows changes from ALL worktrees
   - Changes in `worktrees/scripts-web/` appear when that branch is active
   - Changes in `worktrees/scenes-web/` appear when that branch is active

5. **Test workflow:**
   - Make changes in Terminal in `worktrees/scripts-web/`
   - Switch to GitHub Desktop
   - Switch to `feature/scripts-app-test` branch
   - You should see the changes you made
   - Commit directly from GitHub Desktop

### 5. Test Simultaneous Work

Open multiple Terminal windows:

**Terminal 1:**
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scripts-web
git branch --show-current  # feature/scripts-app-test
# Make changes to scripts-web app
```

**Terminal 2:**
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scenes-web
git branch --show-current  # feature/scenes-app-test
# Make changes to scenes-web app
```

**Terminal 3:**
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/shared-lib
git branch --show-current  # feature/shared-lib-test
# Make changes to shared-lib package
```

All three can run dev servers simultaneously:
```bash
# In scripts-web worktree
pnpm dev  # Runs on port 3001

# In scenes-web worktree
pnpm dev  # Runs on port 3002

# In shared-lib worktree
pnpm test --watch
```

### 6. What to Look For

**Advantages to Verify:**
- ✅ Can work on multiple features without branch switching
- ✅ Each worktree has its own node_modules (no reinstall when switching)
- ✅ Can run multiple dev servers simultaneously
- ✅ GitHub Desktop shows all branches and changes clearly
- ✅ Commits in one worktree don't affect others until merged

**Potential Issues to Watch:**
- ❓ Does GitHub Desktop handle multiple worktrees intuitively?
- ❓ Is it clear which worktree you're in when using Terminal?
- ❓ How do you visualize where each branch lives?
- ❓ What happens when you try to delete a branch that has a worktree?
- ❓ How do you merge changes from one worktree branch to master?

### 7. Testing Merge Workflow

Try merging a feature branch back to master:

```bash
# Make and commit changes in a worktree
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scripts-web
echo "// Feature test" >> apps/scripts-web/README.md
git add apps/scripts-web/README.md
git commit -m "feat: test feature in worktree"

# Switch to main repo and merge
cd /Volumes/HestAI-Projects/eav-monorepo-experimental
git checkout master
git merge feature/scripts-app-test

# Check the result
git log --oneline -5
```

### 8. Cleanup Testing

When you want to remove a worktree:

```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental

# Remove a worktree (doesn't delete the branch)
git worktree remove worktrees/scripts-web

# List remaining worktrees
git worktree list

# Re-add if needed
git worktree add worktrees/scripts-web feature/scripts-app-test
```

## Key Questions to Answer

During your testing, evaluate these questions:

1. **Developer Experience:**
   - Is it intuitive to navigate between worktrees?
   - Does GitHub Desktop make the workflow clearer or more confusing?
   - How easy is it to know which branch you're on in Terminal?

2. **Workflow Efficiency:**
   - Can you genuinely work on multiple features simultaneously?
   - Does this save time compared to branch switching?
   - Are there any workflow friction points?

3. **Mental Model:**
   - Is the worktree concept easy to understand and explain?
   - Would other developers find this intuitive?
   - How would you document this for team onboarding?

4. **Integration with Tools:**
   - Does VS Code handle worktrees well?
   - Does GitHub Desktop visualization match expectations?
   - Any issues with dev servers, builds, or tests?

5. **Practical Concerns:**
   - Disk space usage (each worktree has node_modules)?
   - Any gotchas when merging or rebasing?
   - What happens with shared files (root package.json, tsconfig)?

## Technical Notes

### Storage Efficiency

Git worktrees share the same `.git` directory:
```bash
du -sh /Volumes/HestAI-Projects/eav-monorepo-experimental/.git
# Only one .git directory for all worktrees
```

### Worktree Commands Reference

```bash
# List all worktrees
git worktree list

# Add a new worktree
git worktree add <path> <branch>

# Remove a worktree
git worktree remove <path>

# Prune stale worktree info
git worktree prune
```

## Next Steps After Testing

Based on your testing results:

1. **If worktrees work well:**
   - Document the workflow for team
   - Create setup scripts
   - Update onboarding documentation
   - Plan migration strategy

2. **If worktrees have issues:**
   - Document specific problems encountered
   - Compare with alternative workflows
   - Decide on branch-switching or other strategies

## Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [GitHub Desktop with Worktrees](https://github.com/desktop/desktop/issues/10863)
- Production EAV Ops Suite: `/Volumes/HestAI-Projects/eav-ops/`

---

**Remember:** This is an EXPERIMENTAL repository for TESTING ONLY. Do not deploy or use in production.
