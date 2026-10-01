import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/theme';

interface Props {title: string; uri?: string; large?: boolean}
export function BookCover({title, uri, large = false}: Props) {
  const [failed, setFailed] = useState(false);
  const dimensions = large ? styles.large : styles.small;
  if (!uri || failed) {
    return (
      <View accessibilityLabel={`No cover available for ${title}`} style={[styles.fallback, dimensions]}>
        <Text style={styles.mark}>B</Text>
        <Text numberOfLines={3} style={styles.fallbackTitle}>{title}</Text>
      </View>
    );
  }
  return <Image accessibilityLabel={`Cover of ${title}`} source={{uri}} resizeMode="cover" onError={() => setFailed(true)} style={[styles.image, dimensions]} />;
}
const styles = StyleSheet.create({
  small: {width: 82, height: 122}, large: {width: 140, height: 208},
  image: {backgroundColor: colors.sky, borderRadius: 8},
  fallback: {alignItems: 'center', backgroundColor: colors.inkSoft, borderRadius: 8, justifyContent: 'center', padding: 8},
  mark: {color: colors.accent, fontSize: 28, fontWeight: '900'},
  fallbackTitle: {color: colors.white, fontSize: 10, fontWeight: '700', textAlign: 'center'},
});

