import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {BookSummary} from '../types/books';
import {colors, spacing} from '../theme/theme';
import {BookCover} from './BookCover';

interface Props {book: BookSummary; onPress: () => void}
export function BookCard({book, onPress}: Props) {
  const meta = [book.firstPublishYear ? `First published ${book.firstPublishYear}` : undefined, book.editionCount ? `${book.editionCount} editions` : undefined].filter(Boolean).join(' · ');
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`View details for ${book.title}`} onPress={onPress} style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <BookCover title={book.title} uri={book.coverUrl} />
      <View style={styles.copy}>
        <Text numberOfLines={2} style={styles.title}>{book.title}</Text>
        <Text numberOfLines={2} style={styles.author}>{book.authors.length ? book.authors.join(', ') : 'Unknown author'}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        <Text style={styles.link}>View details  →</Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {backgroundColor: colors.white, marginHorizontal: spacing.lg, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: spacing.lg, padding: spacing.md, shadowColor: colors.ink, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 7, elevation: 2},
  pressed: {opacity: 0.76, transform: [{scale: 0.99}]}, copy: {flex: 1, justifyContent: 'center'},
  title: {color: colors.ink, fontSize: 17, fontWeight: '800', lineHeight: 22},
  author: {color: colors.inkSoft, fontSize: 14, lineHeight: 20, marginTop: spacing.xs},
  meta: {color: colors.muted, fontSize: 12, marginTop: spacing.sm},
  link: {color: colors.accentDark, fontSize: 13, fontWeight: '800', marginTop: spacing.md},
});

