# white cube

white cube is an ongoing project created to visualize and plan art exhibitions. The currently shown space is an example gallery with artworks by the painter Fujishima Takeji.

Planned features: creating an account, uploading files to display, customizing the gallery space and showing other formats such as paper, sculpture and video.

Instructions: look around with mouse, move around with arrow keys, or 'W', 'A', 'S' and 'D' keys. Jump with space, crouch with shift. Walk up to artworks and click to grab them, then click again to place them on the point of the wall that is in the middle of your screen. When an artwork is grabbed, you can press the 'X' key or release it on a surface that is not a wall to cancel the move. To exit the space and get your cursor back, press escape.

Find the easter egg to enter no gravity mode!

## Tech Stack

- **3D & Graphics:** Three.js & React Three Fiber (R3F)
- **Utilities / Helpers:** @react-three/drei
- **Physics:** Rapier (R3F physics engine)
- **Frontend:** React
- **State Management:** Zustand
- **Dev Environment:** Vite

## How to run locally

1. Clone the repo:

```bash
git clone https://github.com/karinknutsson/white-cube.git
cd white-cube
```

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
npm run dev
```

## Adding artworks

Only available when running locally for now. After cloning the repo, add image files to `public/works` folder. Inside the `data/exampleArtworks.js`you can replace the displayed artworks with the ones added to the folder. Remember to set the dimensions in meters in the size property.
