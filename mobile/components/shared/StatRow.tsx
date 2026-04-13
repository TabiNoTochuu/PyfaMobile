import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  label: string;
  value: string;
  warn?: boolean;
}

export function StatRow({ label, value, warn = false }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, warn && styles.warn]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  value: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
  },
  warn: {
    color: Colors.danger,
  },
});
