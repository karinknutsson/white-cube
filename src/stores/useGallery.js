import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";
import { ARTWORKS } from "../data/exampleArtworks";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Artworks
       */
      artworks: structuredClone(ARTWORKS),

      moveArtwork: (id, updates) =>
        set((state) => ({
          artworks: state.artworks.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
    };
  })
);
