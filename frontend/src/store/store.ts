import { User } from "@/lib/types";
import { tokenStorage } from "@/lib/utils";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  clearAuth: () => {
    // Clear token from localStorage using utility
    tokenStorage.remove();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
