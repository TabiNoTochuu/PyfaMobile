import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { EVEIcon } from '../shared/EVEIcon';
import type { ModuleOut, ModuleState } from '../../types';

const STATE_COLORS: Record<ModuleState, string> = {
  offline:  Colors.stateOffline,
  online:   Colors.stateOnline,
  active:   Colors.stateActive,
  overload: Colors.stateOverload,
};

const SLOT_BG: Record<string, string> = {
  high:      Colors.slotHigh,
  mid:       Colors.slotMid,
  low:       Colors.slotLow,
  rig:       Colors.slotRig,
  subsystem: Colors.slotRig,
};

interface Props {
  module: ModuleOut | null;
  slot: string;
  position: number;
  onTap: () => void;
  onLongPress: (module: ModuleOut, position: number) => void;
  onStateChange: (position: number, state: ModuleState) => void;
}

export function ModuleSlot({
  module, slot, position, onTap, onLongPress, onStateChange,
}: Props) {
  const bg = SLOT_BG[slot] ?? Colors.surface;

  if (!module) {
    return (
      <TouchableOpacity style={[styles.slot, { backgroundColor: bg }]} onPress={onTap}>
        <Text style={styles.empty}>+ Empty</Text>
      </TouchableOpacity>
    );
  }

  const handleLongPress = () => {
    Alert.alert(
      module.typeName,
      module.chargeTypeName ? `Charge: ${module.chargeTypeName}` : undefined,
      [
        { text: 'Set Offline',  onPress: () => onStateChange(position, 'offline') },
        { text: 'Set Online',   onPress: () => onStateChange(position, 'online') },
        { text: 'Set Active',   onPress: () => onStateChange(position, 'active') },
        { text: 'Set Overload', onPress: () => onStateChange(position, 'overload') },
        { text: 'Remove',       style: 'destructive', onPress: () => onLongPress(module, position) },
        { text: 'Cancel',       style: 'cancel' },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={[styles.slot, { backgroundColor: bg }]}
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      <EVEIcon typeID={module.typeID} size={32} />
      <Text style={styles.name} numberOfLines={1}>{module.typeName}</Text>
      <View style={[styles.dot, { backgroundColor: STATE_COLORS[module.state] }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 2,
    borderRadius: 4,
    gap: 8,
  },
  name: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },
  empty: {
    flex: 1,
    color: Colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
