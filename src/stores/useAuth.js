import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export default create(
  subscribeWithSelector((set) => {
    return {
      user: null,
      session: null,
      loading: false,
      error: null,

      signup: async (email, password) => {
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          set({ loading: false, error: error.message });
          return { error };
        }
        set({ user: data.user, session: data.session, loading: false });
        return { data };
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          set({ loading: false, error: error.message });
          return { error };
        }
        set({ user: data.user, session: data.session, loading: false });
        return { data };
      },

      logout: async () => {
        set({ loading: true, error: null });
        const { error } = await supabase.auth.signOut();
        if (error) {
          set({ loading: false, error: error.message });
          return { error };
        }
        set({ user: null, session: null, loading: false });
      },

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      clearError: () => set({ error: null }),
    };
  }),
);
