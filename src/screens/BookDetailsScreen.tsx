import React from 'react';
import {ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';

import {getBookDetails} from '../api/books';
import {getErrorMessage} from '../api/client';
import {BookCover} from '../components/BookCover';
import {OfflineBanner} from '../components/OfflineBanner';
import {useSlowRequest} from '../hooks/useSlowRequest';
import {RootStackParamList} from '../navigation/types';
import {colors, spacing} from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetails'>;

function Fact({label, value}: {label: string; value?: string}) {
  if (!value) return null;
  return <View style={styles.fact}><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue}>{value}</Text></View>;
}

export function BookDetailsScreen({route}: Props) {
  const {book} = route.params;
  const netInfo = useNetInfo();
  const details = useQuery({
    queryKey: ['books', 'details', book.editionId ?? book.workId],
    queryFn: () => getBookDetails(book),
  });
  const isSlow = useSlowRequest(details.isPending && details.fetchStatus === 'fetching');
  const data = details.data;
  const title = data?.title ?? book.title;
  const authors = data?.authors ?? book.authors;

  return (
    <View style={styles.root}>
      {netInfo.isConnected === false ? <OfflineBanner /> : null}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <BookCover large title={title} uri={data?.coverUrl ?? book.coverUrl} />
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>BOOK DETAILS</Text>
            <Text style={styles.title}>{title}</Text>
            {data?.subtitle ? <Text style={styles.subtitle}>{data.subtitle}</Text> : null}
            <Text style={styles.author}>{authors.length ? authors.join(', ') : 'Unknown author'}</Text>
          </View>
        </View>

        {details.isPending ? (
          <View accessibilityRole="alert" style={styles.notice}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.noticeText}>{isSlow ? 'This is taking longer than usual…' : 'Loading edition details…'}</Text>
          </View>
        ) : null}
        {details.isError ? (
          <View accessibilityRole="alert" style={[styles.notice, styles.errorNotice]}>
            <View style={styles.noticeCopy}><Text style={styles.errorTitle}>Details unavailable</Text><Text style={styles.errorText}>{getErrorMessage(details.error)}</Text></View>
            <Pressable accessibilityRole="button" onPress={() => details.refetch()}><Text style={styles.retry}>Retry</Text></Pressable>
          </View>
        ) : null}

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Edition information</Text>
          <Fact label="Published" value={data?.publishDate ?? (book.firstPublishYear ? String(book.firstPublishYear) : undefined)} />
          <Fact label="Publisher" value={data?.publishers.join(', ')} />
          <Fact label="Pages" value={data?.pageCount ? String(data.pageCount) : undefined} />
          <Fact label="Edition" value={book.editionId} />
          <Fact label="ISBN" value={book.isbn} />
          {!details.isPending && !data?.publishDate && !data?.pageCount && !data?.publishers.length ? (
            <Text style={styles.missing}>Open Library has limited metadata for this edition.</Text>
          ) : null}
        </View>

        {data?.subjects.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <View style={styles.chips}>{data.subjects.map(subject => <View key={subject} style={styles.chip}><Text style={styles.chipText}>{subject}</Text></View>)}</View>
          </View>
        ) : null}

        {data?.identifiers.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identifiers</Text>
            {data.identifiers.map(identifier => <Text key={identifier} style={styles.identifier}>{identifier}</Text>)}
          </View>
        ) : null}

        {data?.openLibraryUrl ? (
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(data.openLibraryUrl!)} style={({pressed}) => [styles.openButton, pressed && styles.pressed]}>
            <Text style={styles.openButtonText}>Open on Open Library  ↗</Text>
          </Pressable>
        ) : null}
        <Text style={styles.source}>Book metadata provided by Open Library.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {backgroundColor: colors.paper, flex: 1}, content: {paddingBottom: spacing.xxl},
  hero: {alignItems: 'center', backgroundColor: colors.ink, flexDirection: 'row', gap: spacing.xl, padding: spacing.xl},
  heroCopy: {flex: 1}, kicker: {color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.5},
  title: {color: colors.white, fontSize: 25, fontWeight: '900', letterSpacing: -0.5, lineHeight: 30, marginTop: spacing.sm},
  subtitle: {color: '#CBD5E1', fontSize: 14, lineHeight: 19, marginTop: spacing.sm},
  author: {color: '#CBD5E1', fontSize: 15, lineHeight: 21, marginTop: spacing.md},
  notice: {alignItems: 'center', backgroundColor: colors.sky, flexDirection: 'row', gap: spacing.md, margin: spacing.lg, padding: spacing.md, borderRadius: 10},
  noticeText: {color: colors.inkSoft, flex: 1, fontSize: 13, fontWeight: '600'}, errorNotice: {backgroundColor: colors.dangerSoft},
  noticeCopy: {flex: 1}, errorTitle: {color: colors.danger, fontWeight: '800'}, errorText: {color: colors.danger, fontSize: 12, marginTop: 2}, retry: {color: colors.danger, fontWeight: '900', padding: spacing.sm},
  panel: {backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1, margin: spacing.lg, padding: spacing.lg},
  section: {marginHorizontal: spacing.lg, marginTop: spacing.md}, sectionTitle: {color: colors.ink, fontSize: 18, fontWeight: '900', marginBottom: spacing.md},
  fact: {borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.md},
  factLabel: {color: colors.muted, fontSize: 13, width: 82}, factValue: {color: colors.ink, flex: 1, fontSize: 14, fontWeight: '600'},
  missing: {color: colors.muted, fontSize: 13, fontStyle: 'italic', lineHeight: 20}, chips: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.sky, borderRadius: 16, paddingHorizontal: spacing.md, paddingVertical: spacing.sm}, chipText: {color: colors.inkSoft, fontSize: 12, fontWeight: '600'},
  identifier: {color: colors.muted, fontSize: 12, lineHeight: 20}, openButton: {alignItems: 'center', backgroundColor: colors.accent, borderRadius: 12, margin: spacing.lg, padding: spacing.lg},
  openButtonText: {color: colors.ink, fontWeight: '900'}, pressed: {opacity: 0.78}, source: {color: colors.muted, fontSize: 11, textAlign: 'center'},
});
