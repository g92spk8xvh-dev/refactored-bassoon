# TP52 Sailboat Racing Game

A 3D sailboat racing game featuring a TP52 yacht with realistic sailing physics and beautiful ocean graphics.

## Features

- **Realistic TP52 Model**: Detailed 3D model featuring hull, deck, mast, mainsail, jib, and keel
- **Sailing Physics**: Wind-based propulsion with realistic sailing angles and speed calculations
- **Dynamic Ocean**: Animated water with wave effects and boat movement
- **Racing Course**: Navigate through a series of buoy checkpoints
- **Multiple Camera Modes**: Follow cam, chase cam, and overhead view
- **Realistic Mechanics**:
  - Wind direction and speed simulation
  - Sail trim adjustment
  - Boat heel (tilt) based on wind pressure
  - Wave bobbing and rolling
  - Tacking maneuvers

## Controls

| Control | Action |
|---------|--------|
| **A** or **←** | Steer left |
| **D** or **→** | Steer right |
| **W** or **↑** | Trim sails in (tighter) |
| **S** or **↓** | Trim sails out (looser) |
| **Space** | Tack (quick turn through wind) |
| **C** | Change camera view |

## How to Play

1. Start a local web server in the game directory:
   ```bash
   python3 -m http.server 8000
   ```
   Or use any other local web server of your choice
2. Open your browser and navigate to `http://localhost:8000`
3. Click "Start Racing" to begin
4. Navigate through all checkpoints to complete the race
5. Watch the wind indicator (top right) to plan your course
6. Adjust sail trim for optimal speed at different wind angles

## Sailing Tips

- **Close Hauled (45° to wind)**: Trim sails tight, slower but lets you sail upwind
- **Beam Reach (90° to wind)**: Fastest point of sail, moderate sail trim
- **Running (downwind)**: Sails loose, moderate speed
- **In Irons**: Too close to wind (<30°), boat will stall!

The optimal sail trim changes based on wind angle - experiment to find the sweet spot!

## Technical Details

- **Engine**: Three.js for 3D graphics
- **Physics**: Custom sailing simulation with wind vectors and boat dynamics
- **Graphics**:
  - Animated ocean with wave generation
  - Real-time shadows
  - Dynamic camera system
  - Weather fog effects

## TP52 Yacht Class

The TP52 is a high-performance racing yacht class known for:
- 52 feet in length
- Sleek, modern hull design
- Large sail area for maximum speed
- Used in professional racing circuits worldwide

This game captures the excitement of racing these incredible machines!

## Requirements

- Modern web browser with WebGL support
- No installation or build process needed
- Internet connection (for Three.js CDN)

---

## Political Bumper End Graphic (After Effects)

Adobe After Effects ExtendScript for creating a modern political motion graphic with WPA-style Americana influences. Perfect for video end transitions featuring a logo reveal.

### Files

| File | Description |
|------|-------------|
| `political-bumper.jsx` | Main After Effects script |
| `political-bumper-colors.jsx` | Color preset reference |

### Features

- **WPA-Style Sunburst Rays**: Classic rising sun motif with animated rays
- **Geometric Stripes**: Animated diagonal stripes with staggered reveal
- **Star Accents**: Patriotic star elements with rotation animations
- **Logo Placeholder**: Easy-to-replace placeholder for your logo
- **Title Bar**: Modern lower-third style element
- **Frame Border**: Clean framing element

### How to Use

1. Open Adobe After Effects
2. Go to **File > Scripts > Run Script File**
3. Select `political-bumper.jsx`
4. The composition will be created and opened automatically

### Customizing Colors

Colors are easily configured at the top of `political-bumper.jsx`:

```javascript
colors: {
    primary: {
        red:   [0.698, 0.132, 0.203],    // #B22234
        white: [1.000, 1.000, 1.000],    // #FFFFFF
        blue:  [0.234, 0.234, 0.430]     // #3C3C6E
    }
}
```

See `political-bumper-colors.jsx` for preset color schemes including:
- Classic American Flag
- Vintage WPA Poster Style
- Modern Campaign styles
- Bold News Network
- Retro Americana

### Adding Your Logo

1. Import your logo into the After Effects project
2. Select the `LOGO_PLACEHOLDER` layer
3. Use **Edit > Replace With** to swap in your logo
4. Delete the `Logo_Text_Indicator` layer

### Customizing Timing

Adjust the `CONFIG.timing` section to modify animation timing:

```javascript
timing: {
    raysStart: 0,       // Sunburst animation start
    raysEnd: 1.5,       // Sunburst animation end
    stripesStart: 0.3,  // Stripes animation start
    logoFadeIn: 1.8,    // Logo fade begins
    logoFullOn: 2.2     // Logo fully visible
}
```

---

## License

MIT License - Feel free to modify and share!
