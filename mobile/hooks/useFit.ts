/**
 * Fit data hooks — load/mutate fits and keep Zustand store in sync.
 *
 * Every mutation calls /stats/full immediately after so the UI reflects
 * updated numbers without a second round-trip.
 */
import { useCallback, useState } from 'react';
import { api } from './useApi';
import { useStore } from '../store';
import type { FitFull, FitLite, FullStats, ModuleState } from '../types';

export function useFitList() {
  const setFits = useStore((s) => s.setFits);
  const fits = useStore((s) => s.fits);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<FitLite[]>('/fits');
      setFits(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load fits');
    } finally {
      setLoading(false);
    }
  }, [setFits]);

  return { fits, loading, error, refresh };
}

export function useActiveFit() {
  const setActiveFit = useStore((s) => s.setActiveFit);
  const setActiveStats = useStore((s) => s.setActiveStats);
  const activeFit = useStore((s) => s.activeFit);
  const activeStats = useStore((s) => s.activeStats);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (fitID: number) => {
    setLoading(true);
    try {
      const [fitRes, statsRes] = await Promise.all([
        api.get<FitFull>(`/fits/${fitID}`),
        api.get<FullStats>(`/fits/${fitID}/stats/full`),
      ]);
      setActiveFit(fitRes.data);
      setActiveStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  }, [setActiveFit, setActiveStats]);

  /** Refresh stats after any mutation. */
  const refreshStats = useCallback(async (fitID: number) => {
    const [fitRes, statsRes] = await Promise.all([
      api.get<FitFull>(`/fits/${fitID}`),
      api.get<FullStats>(`/fits/${fitID}/stats/full`),
    ]);
    setActiveFit(fitRes.data);
    setActiveStats(statsRes.data);
  }, [setActiveFit, setActiveStats]);

  const addModule = useCallback(async (
    fitID: number, typeID: number, slot: string, position: number,
  ) => {
    await api.post(`/fits/${fitID}/modules`, { typeID, slot, position });
    await refreshStats(fitID);
  }, [refreshStats]);

  const removeModule = useCallback(async (fitID: number, position: number) => {
    await api.delete(`/fits/${fitID}/modules/${position}`);
    await refreshStats(fitID);
  }, [refreshStats]);

  const setModuleState = useCallback(async (
    fitID: number, position: number, state: ModuleState,
  ) => {
    await api.put(`/fits/${fitID}/modules/${position}/state`, { state });
    await refreshStats(fitID);
  }, [refreshStats]);

  const addDrone = useCallback(async (fitID: number, typeID: number, count = 1) => {
    await api.post(`/fits/${fitID}/drones`, { typeID, count });
    await refreshStats(fitID);
  }, [refreshStats]);

  const removeDrone = useCallback(async (fitID: number, typeID: number) => {
    await api.delete(`/fits/${fitID}/drones/${typeID}`);
    await refreshStats(fitID);
  }, [refreshStats]);

  return {
    activeFit,
    activeStats,
    loading,
    load,
    refreshStats,
    addModule,
    removeModule,
    setModuleState,
    addDrone,
    removeDrone,
  };
}

export async function createFit(shipTypeID: number, name: string): Promise<FitLite> {
  const { data } = await api.post<FitLite>('/fits', { shipTypeID, name });
  return data;
}

export async function deleteFit(fitID: number): Promise<void> {
  await api.delete(`/fits/${fitID}`);
}

export async function duplicateFit(fitID: number): Promise<FitLite> {
  const { data } = await api.post<FitLite>(`/fits/${fitID}/duplicate`);
  return data;
}

export async function exportEft(fitID: number): Promise<string> {
  const { data } = await api.get<{ eftString: string }>(`/fits/${fitID}/export/eft`);
  return data.eftString;
}

export async function importEft(eftString: string): Promise<FitLite[]> {
  const { data } = await api.post<FitLite[]>('/fits/import/eft', { eftString });
  return data;
}
