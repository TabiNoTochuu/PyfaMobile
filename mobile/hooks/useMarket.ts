import { useCallback, useState } from 'react';
import { api } from './useApi';
import type { ItemFull, ItemLite, ShipLite } from '../types';

export function useShipSearch() {
  const [results, setResults] = useState<ShipLite[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get<ShipLite[]>('/ships/search', { params: { q: query } });
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}

export function useItemSearch() {
  const [results, setResults] = useState<ItemLite[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, slot?: string) => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const params: Record<string, string> = { q: query };
      if (slot) params.slot = slot;
      const { data } = await api.get<ItemLite[]>('/market/search', { params });
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, loading, search, clear };
}

export async function getItemDetail(typeID: number): Promise<ItemFull> {
  const { data } = await api.get<ItemFull>(`/market/item/${typeID}`);
  return data;
}
