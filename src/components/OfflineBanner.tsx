import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../theme/theme';
export function OfflineBanner() {
  return <View accessibilityRole="alert" style={styles.banner}><Text style={styles.text}>Offline · showing saved results when available</Text></View>;
}
const styles = StyleSheet.create({
  banner: {backgroundColor: colors.dangerSoft, padding: spacing.sm},
  text: {color: colors.danger, fontSize: 12, fontWeight: '700', textAlign: 'center'},
});
