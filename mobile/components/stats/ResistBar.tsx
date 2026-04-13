import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  hp: number;
  em: number;
  therm: number;
  kin: number;
  exp: number;
  label: string;
}

function ResistSegment({ value, color, label }: { value: number; color: string; label: string }) {
  const pct = Math.round((1 - value) * 100);
  return (
    <View style={styles.segment}>
      <View style={[styles.bar, { backgroundColor: color, opacity: 0.2 + (pct / 100) * 0.8 }]} />
      <Text style={[styles.pct, { color }]}>{pct}%</Text>
      <Text style={styles.segLabel}>{label}</Text>
    </View>
  );
}

export function ResistBar({ hp, em, therm, kin, exp, label }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hp}>{Math.round(hp).toLocaleString()} HP</Text>
      </View>
      <View style={styles.resists}>
        <ResistSegment value={em}    color={Colors.em}    label="EM" />
        <ResistSegment value={therm} color={Colors.therm} label="TH" />
        <ResistSegment value={kin}   color={Colors.kin}   label="KN" />
        <ResistSegment value={exp}   color={Colors.exp}   label="EX" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  hp: {
    color: Colors.text,
    fontSize: 12,
  },
  resists: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  bar: {
    height: 6,
    width: '100%',
    borderRadius: 3,
  },
  pct: {
    fontSize: 11,
    fontWeight: '600',
  },
  segLabel: {
    color: Colors.textDim,
    fontSize: 10,
  },
});
