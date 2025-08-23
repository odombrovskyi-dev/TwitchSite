[![Deploy to GitHub Pages](https://github.com/odombrovskyi-dev/TwitchSite/actions/workflows/deploy.yml/badge.svg)](https://github.com/odombrovskyi-dev/TwitchSite/actions/workflows/deploy.yml)

# Twitch Streamers Directory

A modern React application showcasing Twitch streamers with search and filtering capabilities.

## Features

- 🔍 **Search & Filter**: Search by name, handle, description, or tags
- 🏷️ **Tag Filtering**: Filter streamers by content categories
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast Loading**: Optimized with Vite
- 🎨 **Modern UI**: Built with Tailwind CSS and custom components

## Prerequisites

You need to have Node.js installed on your system:

1. **Install Node.js** (version 16 or higher):
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version for Windows
   - Run the installer and follow the instructions

2. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   └── ui/          # Reusable UI components
├── lib/
│   └── utils.ts     # Utility functions
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Adding New Streamers

To add new streamers to the directory:

1. Open `src/App.tsx`
2. Find the `STREAMERS` array
3. Add a new streamer object:

```typescript
{
  name: "Streamer Name",
  handle: "twitch_handle",
  tags: ["Category1", "Category2"],
  description: "Brief description of the streamer's content.",
}
```

## Customization

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles inline

### Avatar Sources
- Primary: Twitch avatars via [unavatar.io](https://unavatar.io)
- Fallback: Generated initials avatars via [DiceBear](https://dicebear.com)

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Custom UI Components** (Button, Card, Badge, Input)

## License

MIT License - feel free to use this project as a template for your own directories!
