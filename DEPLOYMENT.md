# GitHub Pages Deployment Setup

This guide will help you deploy your Twitch Streamers directory to GitHub Pages.

## 🚀 Setup Instructions

### 1. Push Your Code to GitHub

1. **Create a new repository** on GitHub (if you haven't already):
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `TwitchSite` (or whatever you prefer)
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README (since you already have files)

2. **Push your local code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Twitch Streamers directory"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/TwitchSite.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. **Go to your repository settings**:
   - Navigate to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" in the left sidebar

2. **Configure Pages**:
   - Source: Select "GitHub Actions"
   - This will use the workflow we created

### 3. Repository Settings

1. **Make sure your repository is public** (for free GitHub Pages)
2. **Repository name should match** the base path in `vite.config.ts`
   - If your repo is named `TwitchSite`, the config is correct
   - If different, update the base path in `vite.config.ts`

## 🔧 How It Works

### GitHub Actions Workflow
The `.github/workflows/deploy.yml` file will:

1. **Trigger on**:
   - Every push to the `main` branch
   - Manual workflow dispatch

2. **Build Process**:
   - Set up Node.js 18
   - Install dependencies with `npm ci`
   - Build the project with `npm run build`
   - Upload the `dist` folder to GitHub Pages

3. **Deploy**:
   - Automatically deploy to GitHub Pages
   - Your site will be available at: `https://YOUR_USERNAME.github.io/TwitchSite/`

### Vite Configuration
The `vite.config.ts` includes:
- **Base path**: `/TwitchSite/` for production (GitHub Pages subdirectory)
- **Local development**: Uses `/` for local development

## 📋 Checklist

- [ ] Repository created and code pushed to GitHub
- [ ] Repository is public
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] First push triggers the deployment workflow
- [ ] Site is accessible at `https://YOUR_USERNAME.github.io/TwitchSite/`

## 🔄 Updating Your Site

After the initial setup, updating is simple:

1. Make changes to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Update streamers list"
   git push
   ```
3. GitHub Actions will automatically rebuild and deploy your site

## 🐛 Troubleshooting

### Common Issues:

1. **404 Error**: 
   - Check if repository is public
   - Verify the base path in `vite.config.ts` matches your repository name

2. **Build Fails**:
   - Check the Actions tab for error details
   - Make sure all dependencies are in `package.json`

3. **White Screen**:
   - Usually a base path issue
   - Verify the repository name matches the Vite config

### Checking Deployment Status:
- Go to the "Actions" tab in your repository
- Click on the latest workflow run to see detailed logs

## 🎉 Success!

Once deployed, your Twitch Streamers directory will be live and accessible to everyone at:
`https://YOUR_USERNAME.github.io/TwitchSite/`

The site will automatically update every time you push changes to the main branch!
