/**
 * Module/item picker — shown when the user taps an empty slot in the
 * fitting editor.  Reads pendingSlot from the store, searches market,
 * and calls addModule on selection.
 */
import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ItemSearchBar } from '../../components/market/ItemSearchBar';
import { ItemList } from '../../components/market/ItemList';
import { useItemSearch } from '../../hooks/useMarket';
import { useActiveFit } from '../../hooks/useFit';
import { useStore } from '../../store';
import type { ItemLite } from '../../types';

export default function MarketPickerScreen() {
  const router = useRouter();
  const pendingSlot = useStore((s) => s.pendingSlot);
  const setPendingSlot = useStore((s) => s.setPendingSlot);
  const { addModule } = useActiveFit();
  const { results, loading, search } = useItemSearch();

  const handleSearch = useCallback((q: string) => {
    search(q, pendingSlot?.slot);
  }, [search, pendingSlot]);

  const handleSelect = useCallback(async (item: ItemLite) => {
    if (!pendingSlot) return;
    try {
      await addModule(pendingSlot.fitID, item.typeID, pendingSlot.slot, pendingSlot.position);
      setPendingSlot(null);
      router.back();
    } catch (e: any) {
      // Module may not fit — the backend returns 422; stay on screen
      console.warn('addModule failed:', e.message);
    }
  }, [pendingSlot, addModule, setPendingSlot, router]);

  return (
    <View style={styles.container}>
      {pendingSlot && (
        <View style={styles.context}>
          <Text style={styles.contextText}>
            Slot: {pendingSlot.slot.toUpperCase()} #{pendingSlot.position + 1}
          </Text>
        </View>
      )}

      <ItemSearchBar
        placeholder={`Search ${pendingSlot?.slot ?? ''} modules…`}
        onSearch={handleSearch}
      />

      {loading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 16 }} />}

      {!loading && results.length === 0 && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Type to search modules</Text>
        </View>
      )}

      <ItemList items={results} onSelect={handleSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  context: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contextText: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  hint: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hintText: { color: Colors.textDim, fontSize: 14 },
});
