# Kashmira Shah - Premium Crockery Website

A React-based website for showcasing Ektra by Srithai Superware crockery products, built with Vite and deployed to GitHub Pages.

## Features

- **Dynamic Product Loading**: Products loaded from `inventory.csv`
- **Product Images**: Automatically matched from `public/images/` folders
- **Quantity Selection**: Users can select quantity up to available stock
- **WhatsApp Integration**: Direct WhatsApp messaging with product details
- **Responsive Design**: Mobile-friendly interface
- **GitHub Pages Ready**: Optimized for static deployment

## Tech Stack

- React 19
- Vite 7
- React Router DOM
- PapaParse (CSV parsing)
- Font Awesome Icons

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173/kashmira-shah/`

### Build for Production

```bash
npm run build
```

This will:
1. **Fetch product images** from the Ektra website (runs `product-images-fetcher`)
2. **Build the React app** with Vite

Build output will be in the `dist/` folder.

**Note:** To skip image fetching and build only:
```bash
npm run build:skip-fetch
```

**To fetch images separately:**
```bash
npm run fetch-images
```

## Deployment to GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **"Deploy from a branch"**
4. Choose **Branch**: `gh-pages` (will be created automatically)
5. Choose **Folder**: `/ (root)`
6. Click **Save**

### Step 2: Build and Deploy

**Recommended: Using gh-pages package**

```bash
cd my-website
npm run build
npx gh-pages -d dist
```

This will:
- Build the website (fetches images automatically)
- Create/update the `gh-pages` branch
- Push the `dist/` folder contents
- Your site will be live at: `https://[your-username].github.io/kashmira-shah/`

**Alternative: Manual Git deployment**

```bash
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

### Important Notes

- **Base Path**: The site is configured for `/kashmira-shah/` base path
- **Routing**: The `404.html` file handles React Router routes on GitHub Pages
- **Repository Name**: If your repository name is different, update `base` in `vite.config.js`

## Project Structure

```
kashmira-shah/
├── my-website/               # React website
│   ├── public/
│   │   ├── inventory.csv     # Product data source (CSV)
│   │   ├── images/           # Product images (organized by product)
│   │   ├── me.jpg            # Profile image
│   │   └── 404.html         # GitHub Pages routing fix
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuantitySelector.jsx
│   │   │   └── WhatsAppButton.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   └── Catalog.jsx
│   │   ├── utils/            # Utility functions
│   │   │   ├── csvParser.js
│   │   │   ├── imageMatcher.js
│   │   │   └── useProducts.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── vite.config.js
└── product-images-fetcher/    # Script to download product images
    └── index.js              # Downloads images to my-website/public/images/
```

## Product Data Format

The `inventory.csv` file should contain the following columns:
- `Corrected Description` - Product name (used for image matching)
- `MRP (Per Pc)` - Maximum Retail Price
- `Selling Price` - Selling price
- `Qty` - Available quantity
- `Type` - Product category/type
- `Set of` - Number of pieces in set
- `Matched URL` - Product URL (optional)

## Image Matching

Product images are automatically matched using the `safeName()` function which:
1. Converts product names to folder-safe names
2. Replaces special characters with dashes
3. Replaces spaces with underscores
4. Matches to folders in `public/images/`

Example: `16pcs Dinner Set Ashley` → `16pcs_Dinner_Set_Ashley`

## Updating Product Images

To download/update product images from the Ektra website:

1. Navigate to the product-images-fetcher directory:
   ```bash
   cd ../product-images-fetcher
   ```

2. Run the image fetcher:
   ```bash
   node index.js
   ```

The script will:
- Read products from `my-website/public/inventory.csv`
- Download images from product URLs
- Save images directly to `my-website/public/images/` (organized by product)
- Skip thumbnail images automatically

## Configuration

### Base Path

The base path is configured in `vite.config.js`:
```javascript
base: '/kashmira-shah/'
```

Update this if your repository name is different.

### WhatsApp Number

Update the phone number in:
- `src/components/WhatsAppButton.jsx`
- `src/components/Contact.jsx`
- `src/App.jsx` (floating button)

## License

© 2025 Kashmira Shah. All rights reserved.
