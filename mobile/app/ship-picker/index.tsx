import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Image, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useShipSearch } from '../../hooks/useMarket';
import { createFit } from '../../hooks/useFit';
import type { ShipLite } from '../../types';

export default function ShipPickerScreen() {
  const router = useRouter();
  const { results, loading, search } = useShipSearch();
  const [creating, setCreating] = useState(false);

  const handleSelect = (ship: ShipLite) => {
    Alert.prompt(
      'Name your fit',
      `Ship: ${ship.name}`,
      async (name) => {
        if (!name?.trim()) return;
        setCreating(true);
        try {
          const fit = await createFit(ship.typeID, name.trim());
          router.replace(`/fitting/${fit.fitID}`);
        } catch (e: any) {
          Alert.alert('Error', e.message ?? 'Could not create fit');
        } finally {
          setCreating(false);
        }
      },
      'plain-text',
      `${ship.name} fit`,
    );
  };

  const renderShip = ({ item }: { item: ShipLite }) => (
    <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
      <Image
        source={{ uri: `https://images.evetech.net/types/${item.typeID}/render?size=128` }}
        style={styles.render}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.group}>{item.groupName}</Text>
        {item.raceName && <Text style={styles.race}>{item.raceName}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search ships…"
        placeholderTextColor={Colors.textDim}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={search}
      />

      {loading && (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 20 }} />
      )}

      {!loading && results.length === 0 && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Type to search ships</Text>
        </View>
      )}

      <FlashList
        data={results}
        keyExtractor={(s) => String(s.typeID)}
        renderItem={renderShip}
        estimatedItemSize={66}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      {creating && (
        <View style={styles.overlay}>
          <ActivityIndicator color={Colors.gold} size="large" />
          <Text style={styles.creatingText}>Creating fit…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  search: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    fontSize: 15,
    margin: 12,
    padding: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 12,
  },
  render: { width: 52, height: 52, backgroundColor: Colors.surface, borderRadius: 4 },
  info: { flex: 1 },
  name: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  group: { color: Colors.textMuted, fontSize: 13 },
  race: { color: Colors.textDim, fontSize: 12 },
  sep: { height: 1, backgroundColor: Colors.border },
  hint: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hintText: { color: Colors.textDim, fontSize: 14 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bg + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  creatingText: { color: Colors.text, fontSize: 15 },
});
