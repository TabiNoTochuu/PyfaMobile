import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { ModuleSlot } from './ModuleSlot';
import type { FitFull, ModuleOut, ModuleState } from '../../types';

interface Props {
  fit: FitFull;
  onSlotTap: (slot: string, position: number) => void;
  onModuleRemove: (position: number) => void;
  onModuleStateChange: (position: number, state: ModuleState) => void;
}

function SectionHeader({ label, used, total }: { label: string; used: number; total: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionCount}>{used}/{total}</Text>
    </View>
  );
}

export function SlotGrid({ fit, onSlotTap, onModuleRemove, onModuleStateChange }: Props) {
  const handleLongPress = (module: ModuleOut, position: number) => {
    onModuleRemove(position);
  };

  const sections: { label: string; key: keyof FitFull; slot: string }[] = [
    { label: 'HIGH SLOTS',      key: 'highSlots',      slot: 'high' },
    { label: 'MID SLOTS',       key: 'midSlots',       slot: 'mid' },
    { label: 'LOW SLOTS',       key: 'lowSlots',       slot: 'low' },
    { label: 'RIGS',            key: 'rigSlots',       slot: 'rig' },
    { label: 'SUBSYSTEMS',      key: 'subsystemSlots', slot: 'subsystem' },
  ];

  return (
    <View style={styles.container}>
      {sections.map(({ label, key, slot }) => {
        const slots = fit[key] as (ModuleOut | null)[];
        if (slots.length === 0) return null;
        const used = slots.filter(Boolean).length;
        return (
          <View key={slot} style={styles.section}>
            <SectionHeader label={label} used={used} total={slots.length} />
            {slots.map((mod, idx) => (
              <ModuleSlot
                key={idx}
                module={mod}
                slot={slot}
                position={idx}
                onTap={() => onSlotTap(slot, idx)}
                onLongPress={handleLongPress}
                onStateChange={onModuleStateChange}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionCount: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});
