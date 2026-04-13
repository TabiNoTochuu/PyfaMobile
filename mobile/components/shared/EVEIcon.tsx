import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  typeID: number;
  size?: number;
  style?: object;
}

/** EVE type icon loaded from the CDN. */
export function EVEIcon({ typeID, size = 40, style }: Props) {
  const uri = `https://images.evetech.net/types/${typeID}/icon?size=64`;
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: 4 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
