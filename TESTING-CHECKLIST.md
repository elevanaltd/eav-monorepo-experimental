# Git Worktrees Testing Checklist

Use this checklist to systematically test the git worktrees workflow.

## ✅ Basic Setup Verification

- [ ] Repository exists at `/Volumes/HestAI-Projects/eav-monorepo-experimental/`
- [ ] Main directory contains apps/, packages/, supabase/, worktrees/
- [ ] Git is initialized (`git status` works)
- [ ] `git worktree list` shows 4 entries (main + 3 worktrees)
- [ ] All branches exist: master, feature/scripts-app-test, feature/scenes-app-test, feature/shared-lib-test

## ✅ Worktree Navigation

- [ ] Can cd to `/Volumes/.../eav-monorepo-experimental/worktrees/scripts-web`
- [ ] Can cd to `/Volumes/.../eav-monorepo-experimental/worktrees/scenes-web`
- [ ] Can cd to `/Volumes/.../eav-monorepo-experimental/worktrees/shared-lib`
- [ ] Each worktree shows correct branch with `git branch --show-current`
- [ ] Each worktree has full repo contents

## ✅ Git Operations in Worktrees

### In scripts-web worktree:
- [ ] `git status` works correctly
- [ ] Can make a test file change
- [ ] Can stage changes with `git add`
- [ ] Can commit with descriptive message
- [ ] `git log` shows commit history
- [ ] Changes are isolated to this branch

### In scenes-web worktree:
- [ ] Same git operations work independently
- [ ] Changes don't affect scripts-web worktree

### In shared-lib worktree:
- [ ] Same git operations work independently
- [ ] Changes don't affect other worktrees

## ✅ GitHub Desktop Integration

- [ ] Can add repository to GitHub Desktop
- [ ] Repository path: `/Volumes/HestAI-Projects/eav-monorepo-experimental`
- [ ] All 4 branches visible in branch dropdown
- [ ] Can switch between branches in GitHub Desktop
- [ ] Changes from active branch's worktree are visible
- [ ] Can commit directly from GitHub Desktop
- [ ] Branch history displays correctly

## ✅ Simultaneous Work Testing

- [ ] Open Terminal window 1 → navigate to scripts-web worktree
- [ ] Open Terminal window 2 → navigate to scenes-web worktree
- [ ] Open Terminal window 3 → navigate to shared-lib worktree
- [ ] Make different changes in each terminal
- [ ] All three terminals work independently
- [ ] No conflicts or branch switching issues

## ✅ Workflow Scenarios

### Scenario 1: Feature Development
- [ ] Create test file in scripts-web worktree
- [ ] Commit to feature/scripts-app-test branch
- [ ] Switch GitHub Desktop to that branch
- [ ] See the commit appear in history
- [ ] File visible in GitHub Desktop

### Scenario 2: Multiple Features
- [ ] Edit file in scripts-web worktree
- [ ] Edit different file in scenes-web worktree
- [ ] Both sets of changes independent
- [ ] Can commit to both branches without switching
- [ ] GitHub Desktop shows both branches have new commits

### Scenario 3: Merging to Master
- [ ] Complete feature work in a worktree branch
- [ ] Navigate to main repo directory
- [ ] Checkout master branch
- [ ] Merge feature branch
- [ ] Feature changes now in master
- [ ] Worktree still on feature branch (unchanged)

## ✅ Developer Experience Evaluation

Rate each aspect (1-5, where 5 is excellent):

- [ ] **Intuitiveness:** How easy is it to understand worktrees? _____/5
- [ ] **Navigation:** How easy to navigate between worktrees? _____/5
- [ ] **Visual Clarity:** Can you tell which worktree you're in? _____/5
- [ ] **GitHub Desktop:** How well does it integrate? _____/5
- [ ] **Terminal Workflow:** How smooth is the terminal experience? _____/5
- [ ] **Mental Overhead:** How much do you need to think about it? _____/5

## ✅ Issues Encountered

Document any problems or friction points:

### Issue 1:
- **What happened:**
- **When:**
- **Impact:** (Minor / Medium / Blocker)
- **Workaround:**

### Issue 2:
- **What happened:**
- **When:**
- **Impact:** (Minor / Medium / Blocker)
- **Workaround:**

### Issue 3:
- **What happened:**
- **When:**
- **Impact:** (Minor / Medium / Blocker)
- **Workaround:**

## ✅ Questions Answered

### Would this work for the team?
- **Answer:**
- **Reasoning:**

### Is it better than branch switching?
- **Answer:**
- **Reasoning:**

### Would it scale to 7+ apps?
- **Answer:**
- **Reasoning:**

### What's the biggest advantage?
- **Answer:**

### What's the biggest disadvantage?
- **Answer:**

## ✅ Recommendation

Based on testing:

- [ ] **RECOMMEND** - Git worktrees significantly improve workflow
- [ ] **CAUTIOUSLY RECOMMEND** - Works but has some friction
- [ ] **DO NOT RECOMMEND** - Issues outweigh benefits
- [ ] **NEEDS MORE TESTING** - Insufficient data to decide

### Final Notes:

---

**Testing completed by:** _______________
**Date:** _______________
**Time spent testing:** _______________ hours
