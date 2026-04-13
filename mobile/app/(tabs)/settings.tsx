import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView, StyleSheet,
  Switch, Text, TouchableOpacity, View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Colors } from '../../constants/colors';
import { api } from '../../hooks/useApi';
import { useStore } from '../../store';
import type { CharacterLite } from '../../types';

export default function SettingsScreen() {
  const [characters, setCharacters] = useState<CharacterLite[]>([]);
  const [version, setVersion] = useState<string>('');
  const [addingESI, setAddingESI] = useState(false);

  useEffect(() => {
    loadCharacters();
    loadVersion();
  }, []);

  const loadCharacters = async () => {
    try {
      const { data } = await api.get<CharacterLite[]>('/characters');
      setCharacters(data);
    } catch { /* ignore */ }
  };

  const loadVersion = async () => {
    try {
      const { data } = await api.get('/meta/version');
      setVersion(data.version ?? '');
    } catch { /* ignore */ }
  };

  const handleAddESI = async () => {
    setAddingESI(true);
    try {
      const { data } = await api.post<{ authUrl: string; state: string }>('/characters/esi/init');
      const result = await WebBrowser.openAuthSessionAsync(
        data.authUrl,
        'pyfa-mobile://esi-callback',
      );

      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const code = parsed.queryParams?.code as string;
        const state = parsed.queryParams?.state as string;
        if (code && state) {
          await api.post('/characters/esi/callback', { code, state });
          await loadCharacters();
          Alert.alert('Success', 'ESI character added');
        }
      }
    } catch (e: any) {
      Alert.alert('ESI Error', e.message ?? 'Could not add ESI character');
    } finally {
      setAddingESI(false);
    }
  };

  const handleRemoveChar = (char: CharacterLite) => {
    if (char.isBuiltin) {
      Alert.alert('Cannot remove built-in characters');
      return;
    }
    Alert.alert('Remove Character', `Remove ${char.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: async () => {
          await api.delete(`/characters/esi/${char.characterID}`);
          loadCharacters();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Characters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CHARACTERS</Text>
        {characters.map((c) => (
          <TouchableOpacity
            key={c.characterID}
            style={styles.row}
            onLongPress={() => handleRemoveChar(c)}
            delayLongPress={500}
          >
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{c.name}</Text>
              <Text style={styles.rowSub}>
                {c.isBuiltin ? 'Built-in' : c.isESI ? 'ESI' : 'Manual'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddESI} disabled={addingESI}>
          {addingESI
            ? <ActivityIndicator color={Colors.gold} />
            : <Text style={styles.addBtnText}>+ Add ESI Character</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.row}>
          <Text style={styles.rowName}>PYFA Mobile</Text>
          <Text style={styles.rowSub}>Version {version || '…'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowName}>License</Text>
          <Text style={styles.rowSub}>GPL-3.0</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 14 },

  section: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: 18,
    overflow: 'hidden',
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    padding: 10,
    paddingBottom: 6,
    backgroundColor: Colors.surfaceAlt,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowInfo: { flex: 1 },
  rowName: { color: Colors.text, fontSize: 14 },
  rowSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },

  addBtn: {
    padding: 14,
    alignItems: 'center',
  },
  addBtnText: { color: Colors.gold, fontSize: 14, fontWeight: '600' },
});
