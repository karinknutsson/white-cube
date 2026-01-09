export const positions = {
  leftWall: {
    rotation: [0, Math.PI * 0.5, 0],
    center: [-3.4, 1.6, 0],
    left: [-3.4, 1.6, 2.25],
    right: [-3.4, 1.6, -2.25],
  },
  rightWall: {
    rotation: [0, -Math.PI * 0.5, 0],
    center: [3.4, 1.6, 0],
    left: [3.4, 1.6, -2.25],
    right: [3.4, 1.6, 2.25],
  },
  backWall: {
    rotation: [0, 0, 0],
    center: [0, 1.6, -4.3],
    left: [-1.75, 1.6, -4.3],
    right: [1.75, 1.6, -4.3],
  },
};
