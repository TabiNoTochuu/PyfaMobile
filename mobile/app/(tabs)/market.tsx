import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ItemSearchBar } from '../../components/market/ItemSearchBar';
import { ItemList } from '../../components/market/ItemList';
import { useItemSearch, getItemDetail } from '../../hooks/useMarket';
import type { ItemLite } from '../../types';

export default function MarketScreen() {
  const router = useRouter();
  const { results, loading, search } = useItemSearch();

  const handleSelect = async (item: ItemLite) => {
    // For now navigate to a detail route; full item detail screen is Phase 5
    router.push(`/market/item/${item.typeID}`);
  };

  return (
    <View style={styles.container}>
      <ItemSearchBar placeholder="Search modules, ships, drones…" onSearch={search} />
      {loading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 20 }} />}
      {!loading && results.length === 0 && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Search EVE items</Text>
        </View>
      )}
      <ItemList items={results} onSelect={handleSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hint: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hintText: { color: Colors.textDim, fontSize: 14 },
});
