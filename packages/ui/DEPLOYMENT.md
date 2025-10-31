# Deployment Authentication Guide

## GitHub Packages Authentication for @elevanaltd/ui

This package depends on `@elevanaltd/shared-lib@^0.1.8` which is hosted on GitHub Packages. Authentication is required to install dependencies.

---

## CI/CD (GitHub Actions)

**Handled Automatically** ✅

GitHub Actions provides `GITHUB_TOKEN` automatically, but workflows must explicitly request `packages` permissions.

**Required Permissions:**
```yaml
permissions:
  contents: read
  packages: read   # CI workflow (downloads dependencies)
  packages: write  # Publish workflow (publishes package)
```

Our workflows configure authentication via:
```yaml
- name: Configure GitHub Packages authentication
  run: |
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.GITHUB_TOKEN }}" >> ~/.npmrc
    echo "@elevanaltd:registry=https://npm.pkg.github.com/" >> ~/.npmrc

- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Local Development

### Option 1: Personal Access Token (Recommended)

1. **Create GitHub Personal Access Token:**
   - Visit: https://github.com/settings/tokens/new
   - Scopes required: `read:packages`
   - Generate token (save securely)

2. **Configure npm:**
```bash
# Add to ~/.npmrc (global authentication)
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc
echo "@elevanaltd:registry=https://npm.pkg.github.com/" >> ~/.npmrc
```

3. **Install dependencies:**
```bash
cd /Volumes/HestAI-Projects/eav-ops/eav-ui
npm install
```

### Option 2: Project-Specific .npmrc

```bash
# In eav-ui directory
cat > .npmrc.local << 'EOF'
@elevanaltd:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
EOF

# Use local config
npm install --userconfig .npmrc.local
```

**⚠️ Security:** Never commit `.npmrc.local` with tokens (already in .gitignore)

---

## Deployment Environments (Vercel, Railway, Render)

### Vercel

**Environment Variable Required:**

```bash
# In Vercel project settings → Environment Variables
NODE_AUTH_TOKEN=ghp_YOUR_GITHUB_TOKEN_HERE
```

**Build Settings:**
```bash
# Install Command (Vercel uses this)
npm ci

# Vercel automatically uses NODE_AUTH_TOKEN if .npmrc references it
```

**Note:** The project `.npmrc` file references `${NODE_AUTH_TOKEN}`:
```
@elevanaltd:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Vercel substitutes `${NODE_AUTH_TOKEN}` with the environment variable during build.

### Railway

Same pattern as Vercel:

1. **Add Environment Variable:**
   ```
   NODE_AUTH_TOKEN=ghp_YOUR_GITHUB_TOKEN_HERE
   ```

2. **Build Command:**
   ```bash
   npm ci && npm run build
   ```

### Render

Same pattern as Vercel/Railway:

1. **Environment Variables:**
   ```
   NODE_AUTH_TOKEN=ghp_YOUR_GITHUB_TOKEN_HERE
   ```

2. **Build Command:**
   ```bash
   npm ci && npm run build
   ```

---

## Token Scope Requirements

**Minimum Permissions:**
- `read:packages` (required for downloading @elevanaltd packages)

**Creating Token:**
1. Visit: https://github.com/settings/tokens/new
2. Note: "Deploy eav-ui to [environment]"
3. Expiration: Choose appropriate duration (90 days recommended for production)
4. Scopes: Check `read:packages`
5. Generate & save token securely

---

## Troubleshooting

### Error: "401 Unauthorized - GET https://npm.pkg.github.com/download/@elevanaltd/shared-lib/..."

**Cause:** Missing or invalid GitHub Packages authentication

**Solutions:**

**CI/CD:**
- Verify `GITHUB_TOKEN` is available (should be automatic)
- Check workflow permissions: `packages: write` for publish, `packages: read` for install

**Local:**
- Verify token in `~/.npmrc` is valid
- Check token has `read:packages` scope
- Regenerate token if expired

**Deployment (Vercel/Railway/Render):**
- Verify `NODE_AUTH_TOKEN` environment variable is set
- Check token has `read:packages` scope
- Ensure `.npmrc` references `${NODE_AUTH_TOKEN}` correctly

### Error: "404 Not Found - GET https://npm.pkg.github.com/@elevanaltd/shared-lib"

**Cause:** Package not published or not accessible

**Solutions:**
- Verify package exists: https://github.com/elevanaltd/eav-shared-lib/packages
- Check organization membership (private packages)
- Verify `@elevanaltd` scope is configured correctly

---

## Security Best Practices

1. **Never commit tokens to git** (`.npmrc.local` in .gitignore)
2. **Use environment-specific tokens** (separate for dev/staging/prod)
3. **Set token expiration** (90 days maximum for production)
4. **Rotate tokens regularly** (update in deployment env vars)
5. **Limit token scope** (only `read:packages` for consumers)

---

## Package Publication

**Only CI/CD can publish** (restricted to GitHub Actions with `packages: write`)

**Manual publish not recommended** (quality gates enforced via CI)

**Publishing workflow:**
```bash
# Version bump (triggers CI)
npm version patch  # 0.1.0 → 0.1.1
git push origin main
git push --tags    # Triggers publish workflow

# CI workflow publishes to GitHub Packages automatically
```

---

## Related Documentation

- **Shared-lib authentication:** `/Volumes/HestAI-Projects/eav-ops/eav-shared-lib/.npmrc`
- **CI workflows:** `.github/workflows/ci.yml` + `.github/workflows/publish.yml`
- **GitHub Packages docs:** https://docs.github.com/en/packages
- **npm registry docs:** https://docs.npmjs.com/cli/v9/using-npm/registry

---

**Constitutional Mandate:** Authentication is required to maintain package dependency integrity and prevent unauthorized access (SECURITY_AUDIT enforcement).
