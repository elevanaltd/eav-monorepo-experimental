# Quick Start - Git Worktrees Testing

**Get started testing git worktrees in under 5 minutes.**

## 1. Verify Setup

```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental
git worktree list
```

Expected output:
```
/Volumes/.../eav-monorepo-experimental                        [master]
/Volumes/.../eav-monorepo-experimental/worktrees/scenes-web   [feature/scenes-app-test]
/Volumes/.../eav-monorepo-experimental/worktrees/scripts-web  [feature/scripts-app-test]
/Volumes/.../eav-monorepo-experimental/worktrees/shared-lib   [feature/shared-lib-test]
```

## 2. Test Basic Workflow

### Make a change in scripts-web worktree:
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scripts-web
echo "// Test from scripts worktree" >> apps/scripts-web/README.md
git add apps/scripts-web/README.md
git commit -m "test: verify scripts worktree workflow"
```

### Make a different change in scenes-web worktree:
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scenes-web
echo "// Test from scenes worktree" >> apps/scenes-web/src/app/page.tsx
git add apps/scenes-web/src/app/page.tsx
git commit -m "test: verify scenes worktree workflow"
```

### Verify both branches have different commits:
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental
git log feature/scripts-app-test --oneline -2
git log feature/scenes-app-test --oneline -2
```

## 3. Test with GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose: `/Volumes/HestAI-Projects/eav-monorepo-experimental`
4. Click "Current Branch" dropdown
5. Switch between branches to see different changes

## 4. Test Simultaneous Work

Open 3 Terminal windows side-by-side:

**Window 1:**
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scripts-web
git branch --show-current
# Output: feature/scripts-app-test
```

**Window 2:**
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scenes-web
git branch --show-current
# Output: feature/scenes-app-test
```

**Window 3:**
```bash
cd /Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/shared-lib
git branch --show-current
# Output: feature/shared-lib-test
```

Make changes in each window independently!

## 5. Key Observations

Watch for:
- Can you work on 3 features at once without switching branches?
- Does GitHub Desktop show changes clearly?
- Is it easy to know which worktree you're in?
- Any confusion or friction points?

## Next Steps

- See [README.md](./README.md) for detailed testing instructions
- Use [TESTING-CHECKLIST.md](./TESTING-CHECKLIST.md) to track your findings
- Document any issues or observations

## Common Commands

```bash
# List all worktrees
git worktree list

# Check which branch a worktree is on
cd /path/to/worktree && git branch --show-current

# View changes in a specific branch
git log <branch-name> --oneline

# Merge a worktree branch to master
cd /Volumes/HestAI-Projects/eav-monorepo-experimental
git checkout master
git merge <branch-name>
```

## Paths Reference

**Main repo:**
```
/Volumes/HestAI-Projects/eav-monorepo-experimental
```

**Worktrees:**
```
/Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scripts-web
/Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/scenes-web
/Volumes/HestAI-Projects/eav-monorepo-experimental/worktrees/shared-lib
```

---

**Happy Testing!** Document your findings and observations.
