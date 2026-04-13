import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { EVEIcon } from '../shared/EVEIcon';
import type { DroneOut } from '../../types';

interface Props {
  drones: DroneOut[];
  onRemove: (typeID: number) => void;
}

export function DroneList({ drones, onRemove }: Props) {
  if (drones.length === 0) {
    return <Text style={styles.empty}>No drones in bay</Text>;
  }

  return (
    <View>
      {drones.map((d) => (
        <View key={d.typeID} style={styles.row}>
          <EVEIcon typeID={d.typeID} size={28} />
          <Text style={styles.name} numberOfLines={1}>{d.typeName}</Text>
          <Text style={styles.count}>{d.activeCount}/{d.count}</Text>
          <TouchableOpacity onPress={() => onRemove(d.typeID)} style={styles.removeBtn}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 8,
  },
  name: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },
  count: {
    color: Colors.textMuted,
    fontSize: 13,
    minWidth: 36,
    textAlign: 'right',
  },
  removeBtn: {
    padding: 6,
  },
  removeText: {
    color: Colors.danger,
    fontSize: 14,
  },
  empty: {
    color: Colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});
