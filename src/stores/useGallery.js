import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Artwork
       */
      grabbedWorkId: null,

      setGrabbedWorkId: (id) => {
        set((_) => {
          return {
            grabbedWorkId: id,
          };
        });
      },

      dropWallPosition: null,

      setDropWallPosition: (position) => {
        set((_) => {
          return {
            dropWallPosition: position,
          };
        });
      },

      dropWallRotation: null,

      setDropWallRotation: (rotation) => {
        set((_) => {
          return {
            dropWallRotation: rotation,
          };
        });
      },
    };
  })
);
