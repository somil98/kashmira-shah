# GitHub Pages Deployment Guide

## Manual Deployment Steps

### Step 1: Build the Website

```bash
cd my-website
npm run build
```

This will:
1. ✅ Fetch product images from Ektra website
2. ✅ Build the React website
3. ✅ Output files to `dist/` folder

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **"Deploy from a branch"**
4. Choose **Branch**: `gh-pages` (create it if it doesn't exist)
5. Choose **Folder**: `/ (root)`
6. Click **Save**

### Step 3: Deploy to GitHub Pages

**Option A: Using gh-pages package (Recommended)**

```bash
cd my-website
npx gh-pages -d dist
```

This will:
- Create/update the `gh-pages` branch
- Push the `dist/` folder contents (including `CNAME` file)
- Your site will be live at: `https://kashmirashah.store`

**Option B: Manual Git Deployment**

```bash
# Build first
cd my-website
npm run build

# Create/switch to gh-pages branch
git checkout --orphan gh-pages
git rm -rf .

# Copy dist contents
cp -r dist/* .

# Commit and push
git add .
git commit -m "Deploy website"
git push origin gh-pages --force

# Switch back to main
git checkout main
```

### Step 4: Configure Custom Domain (kashmirashah.store)

1. **DNS Configuration** (Already done ✅):
   - Set up 4 A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - All records should have Host: `@` (root domain)

2. **GitHub Pages Settings**:
   - Go to **Settings** → **Pages**
   - Under **Custom domain**, enter: `kashmirashah.store`
   - Check **"Enforce HTTPS"** (will be available after DNS propagates)

3. **CNAME File**:
   - The `CNAME` file is automatically included in the build (located in `public/CNAME`)
   - It contains: `kashmirashah.store`

### Configuration

- **Base Path**: `/` (configured in `vite.config.js` for custom domain)
- **Custom Domain**: `kashmirashah.store`
- **Routing**: `404.html` handles React Router routes
- **Assets**: All images and CSV are in `public/` folder

## Troubleshooting

### Site shows 404
- Make sure GitHub Pages source is set to **"Deploy from a branch"** → `gh-pages`
- Verify the `gh-pages` branch exists and has files
- Check that `dist/` folder was copied correctly to `gh-pages` branch root
- Verify repository name matches the base path (`/kashmira-shah/`)

### Images not loading
- Check that `product-images-fetcher` ran successfully
- Verify images are in `my-website/public/images/`
- Check browser console for 404 errors

### Routes not working
- The `404.html` file handles routing - make sure it's in `dist/`
- For custom domain, `pathSegmentsToKeep = 0` in `404.html` (already configured)

### Custom domain not working / InvalidDNSError

**Error: "Domain's DNS record could not be retrieved (InvalidDNSError)"**

This error means GitHub Pages can't verify your DNS records yet. Follow these steps:

1. **Deploy the site FIRST** (CNAME file must be in gh-pages branch):
   ```bash
   cd my-website
   npm run build
   npx gh-pages -d dist
   ```

2. **Verify DNS records are set correctly**:
   - Check that all 4 A records exist:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - All should have Host: `@` (root domain)
   - Use online DNS checker: https://dnschecker.org/#A/kashmirashah.store

3. **Wait for DNS propagation** (can take 1-48 hours):
   - Check propagation status: https://dnschecker.org/#A/kashmirashah.store
   - Wait until all locations show the 4 IP addresses

4. **After DNS propagates, configure in GitHub**:
   - Go to **Settings** → **Pages**
   - **Remove** the custom domain if already added
   - **Re-add** `kashmirashah.store` as custom domain
   - This forces GitHub to re-check DNS records

5. **Verify CNAME file is deployed**:
   - Check that `gh-pages` branch has `CNAME` file in root
   - File should contain only: `kashmirashah.store` (no extra lines)

6. **Common issues**:
   - DNS hasn't propagated yet (most common - just wait)
   - CNAME file not deployed to gh-pages branch
   - DNS records configured incorrectly
   - Domain added in GitHub before DNS was ready

**Note**: GitHub Pages checks DNS from their servers, which may see different results than your local DNS. Wait for full propagation before adding the domain in GitHub settings.

## Updating Content

To update products or images:

1. **Update CSV**: Edit `my-website/public/inventory.csv`
2. **Update Images**: Run `npm run fetch-images` in `my-website/` (or it will run automatically during build)
3. **Rebuild and Redeploy**:
   ```bash
   cd my-website
   npm run build
   npx gh-pages -d dist
   ```

Your changes will be live within a few minutes!

