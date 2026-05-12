import { create } from "zustand";

export default create((set) => ({
  transformTriggered: false,
  triggerTransform: () => set({ transformTriggered: true }),
  resetTransform: () => set({ transformTriggered: false }),
}));
