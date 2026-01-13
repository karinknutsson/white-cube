import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Artwork
       */
      grabMode: false,

      setGrabMode: (value) => {
        set((_) => {
          return {
            grabMode: value,
          };
        });
      },

      /**
       * Player
       */
      playerRef: null,

      setPlayerRef: (p) => {
        set((_) => {
          return {
            playerRef: p,
          };
        });
      },
    };
  })
);
