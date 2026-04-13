import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { ResistBar } from './ResistBar';
import { CapDisplay } from './CapDisplay';
import { StatRow } from '../shared/StatRow';
import type { FullStats } from '../../types';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

function fmt(n: number, decimals = 0) {
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

function fmtM(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B ISK`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M ISK`;
  return `${fmt(n)} ISK`;
}

interface Props {
  stats: FullStats;
}

export function StatsPanel({ stats }: Props) {
  const { tank, dps, capacitor, navigation, targeting, fitting, price, validation } = stats;
  const cpuWarn = fitting.cpu.used > fitting.cpu.total;
  const pgWarn  = fitting.powergrid.used > fitting.powergrid.total;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!validation.valid && (
        <View style={styles.validationBanner}>
          {validation.issues.map((issue, i) => (
            <Text key={i} style={styles.validationText}>⚠ {issue}</Text>
          ))}
        </View>
      )}

      {/* Quick summary bar */}
      <View style={styles.quickBar}>
        <View style={styles.quickStat}>
          <Text style={styles.quickValue}>{fmt(dps.total, 1)}</Text>
          <Text style={styles.quickLabel}>DPS</Text>
        </View>
        <View style={styles.quickDivider} />
        <View style={styles.quickStat}>
          <Text style={styles.quickValue}>{fmt(tank.effectivehp)}</Text>
          <Text style={styles.quickLabel}>EHP</Text>
        </View>
        <View style={styles.quickDivider} />
        <View style={styles.quickStat}>
          <Text style={[styles.quickValue, { color: capacitor.stable ? Colors.success : Colors.danger }]}>
            {capacitor.stable ? 'Stable' : 'Cap –'}
          </Text>
          <Text style={styles.quickLabel}>CAP</Text>
        </View>
      </View>

      <Section title="OFFENSE" defaultOpen>
        <StatRow label="Turret DPS"   value={`${fmt(dps.turret, 1)}`} />
        <StatRow label="Missile DPS"  value={`${fmt(dps.missile, 1)}`} />
        <StatRow label="Drone DPS"    value={`${fmt(dps.drone, 1)}`} />
        <StatRow label="Total DPS"    value={`${fmt(dps.total, 1)}`} />
        <StatRow label="Volley"       value={`${fmt(dps.volley, 1)}`} />
      </Section>

      <Section title="DEFENSE" defaultOpen>
        <ResistBar label="SHIELD" {...tank.shield} />
        <ResistBar label="ARMOR"  {...tank.armor} />
        <ResistBar label="HULL"   {...tank.hull} />
        <StatRow label="EHP (Uniform)" value={fmt(tank.ehp.uniform)} />
      </Section>

      <Section title="CAPACITOR" defaultOpen>
        <CapDisplay cap={capacitor} />
      </Section>

      <Section title="NAVIGATION">
        <StatRow label="Max Velocity"    value={`${fmt(navigation.maxVelocity)} m/s`} />
        <StatRow label="Align Time"      value={`${navigation.alignTime.toFixed(2)}s`} />
        <StatRow label="Warp Speed"      value={`${navigation.warpSpeed.toFixed(1)} AU/s`} />
        <StatRow label="Signature"       value={`${fmt(navigation.signatureRadius)} m`} />
      </Section>

      <Section title="TARGETING">
        <StatRow label="Target Range"   value={`${(targeting.maxTargetRange / 1000).toFixed(1)} km`} />
        <StatRow label="Scan Res"       value={`${fmt(targeting.scanResolution)} mm`} />
        <StatRow label="Max Targets"    value={`${targeting.maxLockedTargets}`} />
        <StatRow label="Sensor Str"     value={`${targeting.sensorStrength.value.toFixed(1)} (${targeting.sensorStrength.type})`} />
      </Section>

      <Section title="FITTING">
        <StatRow
          label="CPU"
          value={`${fmt(fitting.cpu.used, 1)} / ${fmt(fitting.cpu.total, 1)} tf`}
          warn={cpuWarn}
        />
        <StatRow
          label="Power Grid"
          value={`${fmt(fitting.powergrid.used, 1)} / ${fmt(fitting.powergrid.total, 1)} MW`}
          warn={pgWarn}
        />
        <StatRow label="Calibration" value={`${fitting.calibration.used} / ${fitting.calibration.total}`} />
        <StatRow label="Drone Bay"   value={`${fmt(fitting.droneBay.used)} / ${fmt(fitting.droneBay.total)} m³`} />
      </Section>

      <Section title="PRICE">
        <StatRow label="Hull"  value={fmtM(price.hull)} />
        <StatRow label="Fit"   value={fmtM(price.fit)} />
        <StatRow label="Total" value={fmtM(price.total)} />
        <Text style={styles.priceNote}>Jita sell prices</Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 14, paddingBottom: 40 },

  validationBanner: {
    backgroundColor: Colors.danger + '33',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  validationText: { color: Colors.danger, fontSize: 12 },

  quickBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    justifyContent: 'space-around',
  },
  quickStat: { alignItems: 'center' },
  quickValue: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  quickLabel: { color: Colors.textMuted, fontSize: 11 },
  quickDivider: { width: 1, backgroundColor: Colors.border },

  section: {
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.surfaceAlt,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chevron: { color: Colors.textMuted, fontSize: 10 },
  sectionBody: { padding: 10 },

  priceNote: {
    color: Colors.textDim,
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
