import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../../constants/colors';
import { SlotGrid } from '../../components/fitting/SlotGrid';
import { DroneList } from '../../components/fitting/DroneList';
import { StatsPanel } from '../../components/stats/StatsPanel';
import { useActiveFit } from '../../hooks/useFit';
import { useStore } from '../../store';
import type { ModuleState } from '../../types';

type Tab = 'drones' | 'implants';

export default function FittingEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fitID = Number(id);
  const router = useRouter();

  const setPendingSlot = useStore((s) => s.setPendingSlot);
  const {
    activeFit, activeStats, loading,
    load, removeModule, setModuleState, removeDrone,
  } = useActiveFit();

  // Bottom sheet ref (stats)
  const statsSheet = useRef<BottomSheet>(null);
  const snapPoints = ['8%', '50%', '92%'];
  const [statsOpen, setStatsOpen] = useState(false);

  // Additions tab
  const [addTab, setAddTab] = useState<Tab>('drones');

  useEffect(() => { load(fitID); }, [fitID]);

  const handleSlotTap = useCallback((slot: string, position: number) => {
    setPendingSlot({ fitID, slot, position });
    router.push('/market-picker');
  }, [fitID, setPendingSlot, router]);

  const handleModuleRemove = useCallback(async (position: number) => {
    try { await removeModule(fitID, position); }
    catch (e: any) { Alert.alert('Error', e.message); }
  }, [fitID, removeModule]);

  const handleStateChange = useCallback(async (position: number, state: ModuleState) => {
    try { await setModuleState(fitID, position, state); }
    catch (e: any) { Alert.alert('Error', e.message); }
  }, [fitID, setModuleState]);

  const handleDroneRemove = useCallback(async (typeID: number) => {
    try { await removeDrone(fitID, typeID); }
    catch (e: any) { Alert.alert('Error', e.message); }
  }, [fitID, removeDrone]);

  if (loading && !activeFit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (!activeFit) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Fit not found</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: activeFit.name,
          headerStyle: { backgroundColor: Colors.header },
          headerTintColor: Colors.text,
          headerTitleStyle: { color: Colors.text },
        }}
      />

      <View style={styles.container}>
        {/* Quick stats bar at top */}
        {activeStats && (
          <View style={styles.quickBar}>
            <Text style={styles.quickStat}>
              DPS {activeStats.dps.total.toFixed(0)}
            </Text>
            <Text style={styles.quickStat}>
              EHP {Math.round(activeStats.tank.effectivehp).toLocaleString()}
            </Text>
            <Text style={[
              styles.quickStat,
              { color: activeStats.capacitor.stable ? Colors.success : Colors.danger },
            ]}>
              {activeStats.capacitor.stable ? 'Cap ✓' : 'Cap ✗'}
            </Text>
            <TouchableOpacity onPress={() => {
              statsSheet.current?.expand();
              setStatsOpen(true);
            }}>
              <Text style={styles.statsBtn}>Stats ▲</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main fitting area */}
        <ScrollView style={styles.scroll}>
          <SlotGrid
            fit={activeFit}
            onSlotTap={handleSlotTap}
            onModuleRemove={handleModuleRemove}
            onModuleStateChange={handleStateChange}
          />

          {/* Additions section */}
          <View style={styles.additions}>
            <View style={styles.addTabs}>
              {(['drones', 'implants'] as Tab[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.addTab, addTab === t && styles.addTabActive]}
                  onPress={() => setAddTab(t)}
                >
                  <Text style={[styles.addTabText, addTab === t && styles.addTabTextActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.addContent}>
              {addTab === 'drones' && (
                <DroneList drones={activeFit.drones} onRemove={handleDroneRemove} />
              )}
              {addTab === 'implants' && (
                <Text style={styles.dimText}>
                  {activeFit.implants.length
                    ? activeFit.implants.map((i) => i.typeName).join('\n')
                    : 'No implants'}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Stats bottom sheet */}
        {activeStats && (
          <BottomSheet
            ref={statsSheet}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: Colors.surface }}
            handleIndicatorStyle={{ backgroundColor: Colors.textMuted }}
            onChange={(idx) => setStatsOpen(idx > 0)}
          >
            <BottomSheetScrollView>
              <StatsPanel stats={activeStats} />
            </BottomSheetScrollView>
          </BottomSheet>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.danger, fontSize: 15 },
  scroll: { flex: 1 },

  quickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickStat: { color: Colors.text, fontSize: 13 },
  statsBtn: { color: Colors.gold, fontSize: 13, fontWeight: '600' },

  additions: {
    marginHorizontal: 10,
    marginBottom: 140,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
  },
  addTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
  },
  addTabText: { color: Colors.textMuted, fontSize: 13 },
  addTabTextActive: { color: Colors.text, fontWeight: '600' },
  addContent: { padding: 10 },
  dimText: { color: Colors.textMuted, fontSize: 13 },
});
