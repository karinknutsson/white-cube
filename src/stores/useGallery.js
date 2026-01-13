import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Artwork
       */
      grabbedWorkId: null,

      setGrabbedWorkId: (value) => {
        set((_) => {
          return {
            grabbedWorkId: value,
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
    };
  })
);
