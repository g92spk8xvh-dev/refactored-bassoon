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

1. Open `index.html` in a modern web browser
2. Click "Start Racing" to begin
3. Navigate through all checkpoints to complete the race
4. Watch the wind indicator (top right) to plan your course
5. Adjust sail trim for optimal speed at different wind angles

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

## License

MIT License - Feel free to modify and share!
