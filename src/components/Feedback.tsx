import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../theme/theme';

interface Props {title: string; message?: string; loading?: boolean; actionLabel?: string; onAction?: () => void}
export function Feedback({title, message, loading, actionLabel, onAction}: Props) {
  return (
    <View accessibilityRole="alert" style={styles.container}>
      {loading ? <ActivityIndicator color={colors.accent} size="large" /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {alignItems: 'center', padding: spacing.xxl, gap: spacing.md},
  title: {color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center'},
  message: {color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center'},
  button: {backgroundColor: colors.ink, borderRadius: 10, marginTop: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  pressed: {opacity: 0.75}, buttonText: {color: colors.white, fontWeight: '700'},
});
