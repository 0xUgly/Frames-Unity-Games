# Open-Source-Frames-2.0-Unity-Games

A community-driven framework for deploying Unity WebGL games on Farcaster using Frames 2.0. This repository allows developers to easily share their Unity games with the Farcaster community.

## Overview

This open-source project provides a complete solution for game developers to showcase and distribute their Unity WebGL games through Farcaster Frames 2.0. Players can discover, play, and share games directly within Farcaster clients, creating new opportunities for game discovery and social gameplay.

## Features

- **Game Library**: Showcase multiple Unity WebGL games within a single Frame
- **One-Click Deploy**: Simple deployment process to Vercel
- **Customizable UI**: Easy-to-modify interface for game selection and display
- **Farcaster Integration**: Built-in support for Farcaster's social features and Frame navigation
- **Community-Driven**: Submit your own games to be featured in the collection

## Prerequisites

- Node.js (v16+) and npm
- Unity WebGL build of your game
- Vercel account (for deployment)
- Farcaster account (for testing and sharing)

## Getting Started

### 1. Fork and Clone the Repository

```bash
git clone https://github.com/yourusername/Open-Source-Frames-2.0-Unity-Games.git
cd Open-Source-Frames-2.0-Unity-Games
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_HOST=your-deployment-url.vercel.app
```

For local development, use:
```
NEXT_PUBLIC_HOST=http://localhost:3000
```

### 4. Add Your Unity Game

#### Prepare Your Unity WebGL Build

1. In Unity, generate a WebGL build with appropriate settings:
   - Set compression format to "Disabled" or "Gzip"
   - Configure memory settings (512MB recommended for Frames)
   - Disable development build for production

#### Add Your Game to the Project

1. Create a new folder in `public/games/` with your game's name (e.g., `public/games/my-game/`)
2. Copy your WebGL build files into this folder (including `Build/`, `TemplateData/`, and `index.html`)
3. Add a thumbnail image (recommended size: 300x200px) to `public/thumbnails/` with the same name (e.g., `my-game.png`)

#### Register Your Game

Edit the `src/data/games.js` file to add your game:

```javascript
export const games = [
  // Existing games
  {
    id: "my-game",
    title: "My Awesome Game",
    description: "A brief description of what makes your game special",
    creator: "Your Name",
    thumbnail: "/thumbnails/my-game.png",
    path: "/games/my-game/",
    options: {
      // Optional: Customize Unity loader options
      devicePixelRatio: 1,
      showBanner: false,
    }
  },
];
```

### 5. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see your game in action.

### 6. Deploy to Vercel

Deploy your project to Vercel:

```bash
vercel
```

Or connect your repository to Vercel for automatic deployments.

## Frame Integration Details

This framework handles the Farcaster Frames 2.0 protocol automatically:

- `pages/api/frame.js`: Manages Frame requests/responses and game state
- `pages/game/[id].js`: Renders individual games
- `components/GamePlayer.jsx`: Unity WebGL player integration
- `components/FrameUI.jsx`: Frame navigation and UI elements

## Contributing Your Game to the Main Repository

To have your game featured in the main repository:

1. Fork the repository
2. Add your game following the steps above
3. Submit a pull request with:
   - Your game's WebGL build
   - Thumbnail image
   - Game information added to `src/data/games.js`
   - Brief description of your game

### Contribution Guidelines

- Ensure your game is appropriate for general audiences
- WebGL build should be optimized (under 25MB if possible)
- Include clear instructions for gameplay
- Test thoroughly before submission

## Customizing the Framework

### Modifying the UI

Edit the components in `src/components/` to customize the look and feel:

- `GameSelector.jsx`: Game selection interface
- `GamePlayer.jsx`: Game display and controls
- `Layout.jsx`: Overall layout structure

### Implementing Custom Features

To add custom features:

1. Modify the Frame handling in `pages/api/frame.js`
2. Update game state management in `utils/gameState.js`
3. Add new components as needed

## Troubleshooting

### Common Issues

- **Game Doesn't Load**: Check browser console for errors, ensure WebGL build is correctly configured
- **Frame Navigation Issues**: Verify your environment variables are set correctly
- **Deployment Failures**: Check Vercel logs for detailed error information

### Support

If you encounter issues:

1. Check the [Issues](https://github.com/0xUgly/Open-Source-Frames-2.0-Unity-Games/issues) page for similar problems
2. Create a new issue with detailed information if needed
3. Reach out on Farcaster to @0xUgly

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Farcaster team for creating Frames 2.0
- Unity Technologies
- All contributors who share their games and improvements

---

By making your Unity game available through this framework, you're helping build a vibrant ecosystem of games on Farcaster. We look forward to seeing what you create!
