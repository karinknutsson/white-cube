import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Artwork
       */
      grabbedWorkIndex: null,

      setGrabbedWorkIndex: (value) => {
        set((_) => {
          return {
            grabbedWorkIndex: value,
          };
        });
      },

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
