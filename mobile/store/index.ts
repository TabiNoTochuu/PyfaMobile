import { create } from 'zustand';
import type { CharacterLite, FitFull, FitLite, FullStats } from '../types';

interface AppState {
  // Backend readiness
  backendReady: boolean;
  setBackendReady: (ready: boolean) => void;

  // Fits list
  fits: FitLite[];
  setFits: (fits: FitLite[]) => void;

  // Active fit being edited
  activeFit: FitFull | null;
  setActiveFit: (fit: FitFull | null) => void;

  // Stats for the active fit (refreshed after every mutation)
  activeStats: FullStats | null;
  setActiveStats: (stats: FullStats | null) => void;

  // Characters
  characters: CharacterLite[];
  setCharacters: (chars: CharacterLite[]) => void;
  selectedCharacterID: number | null;
  setSelectedCharacterID: (id: number | null) => void;

  // Market module picker context: when the user taps an empty slot
  // we record which fit/slot we're filling so the market screen knows
  pendingSlot: { fitID: number; slot: string; position: number } | null;
  setPendingSlot: (slot: AppState['pendingSlot']) => void;
}

export const useStore = create<AppState>((set) => ({
  backendReady: false,
  setBackendReady: (ready) => set({ backendReady: ready }),

  fits: [],
  setFits: (fits) => set({ fits }),

  activeFit: null,
  setActiveFit: (fit) => set({ activeFit: fit }),

  activeStats: null,
  setActiveStats: (stats) => set({ activeStats: stats }),

  characters: [],
  setCharacters: (chars) => set({ characters: chars }),

  selectedCharacterID: null,
  setSelectedCharacterID: (id) => set({ selectedCharacterID: id }),

  pendingSlot: null,
  setPendingSlot: (slot) => set({ pendingSlot: slot }),
}));
