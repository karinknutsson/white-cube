import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ARTWORKS } from "../data/exampleArtworks";
import { supabase } from "../lib/supabase";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Show gallery
       */
      showGallery: false,

      setShowGallery: (value) =>
        set((_) => ({
          showGallery: value,
        })),

      /**
       * Gallery dimensions
       */
      roomWidth: null,
      roomHeight: null,
      roomDepth: null,

      fetchGallery: async (id) => {
        const { data, error } = await supabase
          .from("galleries")
          .select("size_x, size_y, size_z")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Failed to fetch gallery:", error);
          return;
        }

        set({
          roomWidth: data.size_x,
          roomHeight: data.size_y,
          roomDepth: data.size_z,
          // showGallery: true,
        });
      },

      /**
       * Artworks
       */
      artworks: structuredClone(ARTWORKS),

      moveArtwork: (id, updates) =>
        set((state) => ({
          artworks: state.artworks.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        })),

      /**
       * No gravity state
       */
      isFloating: false,

      setIsFloating: (value) =>
        set((_) => ({
          isFloating: value,
        })),
    };
  }),
);
