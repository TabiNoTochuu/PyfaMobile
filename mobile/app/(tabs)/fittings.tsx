import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, FlatList, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { EVEIcon } from '../../components/shared/EVEIcon';
import { useFitList, deleteFit, duplicateFit } from '../../hooks/useFit';
import { useStore } from '../../store';
import type { FitLite } from '../../types';

export default function FittingsScreen() {
  const router = useRouter();
  const backendReady = useStore((s) => s.backendReady);
  const { fits, loading, error, refresh } = useFitList();

  useFocusEffect(useCallback(() => { if (backendReady) refresh(); }, [backendReady, refresh]));

  const handleCreate = () => {
    router.push('/ship-picker');
  };

  const handleOpen = (fit: FitLite) => {
    router.push(`/fitting/${fit.fitID}`);
  };

  const handleLongPress = (fit: FitLite) => {
    Alert.alert(fit.name, fit.shipName, [
      {
        text: 'Duplicate', onPress: async () => {
          await duplicateFit(fit.fitID);
          refresh();
        },
      },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Delete Fit', `Delete "${fit.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete', style: 'destructive', onPress: async () => {
                await deleteFit(fit.fitID);
                refresh();
              },
            },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderFit = ({ item }: { item: FitLite }) => (
    <TouchableOpacity
      style={styles.fitRow}
      onPress={() => handleOpen(item)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={400}
    >
      <EVEIcon typeID={item.shipTypeID} size={44} />
      <View style={styles.fitInfo}>
        <Text style={styles.fitName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.fitShip}>{item.shipName}</Text>
        {item.shipClass && (
          <Text style={styles.fitClass}>{item.shipClass}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!backendReady) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Starting backend…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={fits}
        keyExtractor={(f) => String(f.fitID)}
        renderItem={renderFit}
        onRefresh={refresh}
        refreshing={loading}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No fits yet.</Text>
              <Text style={styles.emptyHint}>Tap + to create your first fit.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={fits.length === 0 ? styles.emptyContainer : undefined}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleCreate}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyContainer: { flex: 1 },
  statusText: { color: Colors.textMuted, fontSize: 15 },
  emptyText: { color: Colors.textMuted, fontSize: 16 },
  emptyHint: { color: Colors.textDim, fontSize: 13 },

  errorBanner: {
    backgroundColor: Colors.danger + '33',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.danger,
  },
  errorText: { color: Colors.danger, fontSize: 13 },

  fitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
    backgroundColor: Colors.bg,
  },
  fitInfo: { flex: 1 },
  fitName: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  fitShip: { color: Colors.textMuted, fontSize: 13 },
  fitClass: { color: Colors.textDim, fontSize: 12 },
  sep: { height: 1, backgroundColor: Colors.border },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  fabText: { color: '#000', fontSize: 28, fontWeight: '700', lineHeight: 30 },
});
