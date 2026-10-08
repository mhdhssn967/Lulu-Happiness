import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  theme: 'dark',
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
