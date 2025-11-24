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
- Push the `dist/` folder contents
- Your site will be live at: `https://[your-username].github.io/kashmira-shah/`

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

### Configuration

- **Base Path**: `/kashmira-shah/` (configured in `vite.config.js`)
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
- Check that `pathSegmentsToKeep = 1` in `404.html` matches your base path

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

