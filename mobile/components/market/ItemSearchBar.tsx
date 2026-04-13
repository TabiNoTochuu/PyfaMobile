import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function ItemSearchBar({ placeholder = 'Search…', onSearch, debounceMs = 300 }: Props) {
  const [value, setValue] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(value), debounceMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [value, debounceMs, onSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDim}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => setValue('')} style={styles.clear}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    height: 40,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  clear: { padding: 4 },
  clearText: { color: Colors.textMuted, fontSize: 14 },
});
