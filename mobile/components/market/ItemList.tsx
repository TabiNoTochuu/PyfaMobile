import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../../constants/colors';
import { EVEIcon } from '../shared/EVEIcon';
import type { ItemLite } from '../../types';

const SLOT_LABELS: Record<string, string> = {
  high: 'HI', mid: 'MID', low: 'LO', rig: 'RIG', subsystem: 'SUB',
};

interface Props {
  items: ItemLite[];
  onSelect: (item: ItemLite) => void;
}

function ItemRow({ item, onSelect }: { item: ItemLite; onSelect: (item: ItemLite) => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
      <EVEIcon typeID={item.typeID} size={36} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.group}>{item.groupName}</Text>
      </View>
      {item.slot && (
        <View style={styles.slotBadge}>
          <Text style={styles.slotText}>{SLOT_LABELS[item.slot] ?? item.slot.toUpperCase()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function ItemList({ items, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <FlashList
      data={items}
      keyExtractor={(item) => String(item.typeID)}
      renderItem={({ item }) => <ItemRow item={item} onSelect={onSelect} />}
      estimatedItemSize={58}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 10,
  },
  info: { flex: 1 },
  name: { color: Colors.text, fontSize: 14 },
  group: { color: Colors.textMuted, fontSize: 12 },
  slotBadge: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 60 },
});
