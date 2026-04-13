import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import type { CapStats } from '../../types';

interface Props {
  cap: CapStats;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function CapDisplay({ cap }: Props) {
  const statusColor = cap.stable ? Colors.success : Colors.danger;
  const statusText = cap.stable
    ? `Stable @ ${cap.stableAt?.toFixed(1)}%`
    : cap.timeToEmpty
    ? `Empty in ${formatDuration(cap.timeToEmpty)}`
    : 'Unstable';

  const capacityPct = cap.stableAt ?? 0;

  return (
    <View style={styles.container}>
      {/* Status badge */}
      <View style={[styles.badge, { borderColor: statusColor }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
      </View>

      {/* Capacitor ring — simplified bar */}
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            {
              width: `${cap.stable ? capacityPct : 0}%`,
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>

      <Text style={styles.detail}>
        {Math.round(cap.capacity).toLocaleString()} GJ
        {'  ·  '}
        {(cap.rechargeRate / 1000).toFixed(1)}s recharge
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  detail: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
