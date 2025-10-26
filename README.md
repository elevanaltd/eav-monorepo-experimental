# EAV Monorepo Experimental - Git Worktrees Testing

**EXPERIMENTAL REPOSITORY FOR TESTING PURPOSES ONLY**

This is a testing repository to evaluate git worktrees workflow for the EAV Operations Suite monorepo structure. It contains actual code from the production system but is configured for testing the **developer experience** with git worktrees and GitHub Desktop.

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
│   ├── scripts-web/          (actual production code)
│   ├── scenes-web/           (minimal stub)
│   ├── vo-web/               (minimal stub)
│   └── cam-op-pwa/           (minimal stub)
├── packages/
│   ├── shared-lib/           (actual production code, core modules)
│   ├── types/                (minimal stub)
│   └── schema/               (minimal stub)
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── worktrees/                (git worktrees - each is a full checkout)
    ├── scripts-web/          → feature/scripts-app-test
    ├── scenes-web/           → feature/scenes-app-test
    └── shared-lib/           → feature/shared-lib-test
```

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
