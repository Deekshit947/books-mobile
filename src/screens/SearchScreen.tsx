import React, {useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {searchBooks} from '../api/books';
import {getErrorMessage} from '../api/client';
import {BookCard} from '../components/BookCard';
import {Feedback} from '../components/Feedback';
import {OfflineBanner} from '../components/OfflineBanner';
import {useSlowRequest} from '../hooks/useSlowRequest';
import {RootStackParamList} from '../navigation/types';
import {colors, spacing} from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

function ListSeparator() {
  return <View style={styles.separator} />;
}

export function SearchScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [validation, setValidation] = useState('');

  const result = useInfiniteQuery({
    queryKey: ['books', 'search', query],
    queryFn: ({pageParam}) => searchBooks(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: query.length > 0,
  });

  const books = useMemo(() => result.data?.pages.flatMap(page => page.books) ?? [], [result.data]);
  const total = result.data?.pages[0]?.total ?? 0;
  const isSlow = useSlowRequest(result.isPending && result.fetchStatus === 'fetching');

  function submit() {
    const nextQuery = draft.trim();
    if (nextQuery.length < 2) {
      setValidation('Enter at least 2 characters to search.');
      return;
    }
    setValidation('');
    setQuery(nextQuery);
    Keyboard.dismiss();
  }

  const header = (
    <>
      <View style={[styles.hero, {paddingTop: insets.top + spacing.xl}]}>
        <Text style={styles.eyebrow}>OPEN LIBRARY EXPLORER</Text>
        <Text style={styles.heading}>Find your next great read.</Text>
        <Text style={styles.subheading}>Search millions of works, editions, and authors.</Text>
        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Search books"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={text => {setDraft(text); if (validation) setValidation('');}}
            onSubmitEditing={submit}
            placeholder="Title, author, or ISBN"
            placeholderTextColor="#7C879A"
            returnKeyType="search"
            style={styles.input}
            value={draft}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Search" onPress={submit} style={({pressed}) => [styles.searchButton, pressed && styles.buttonPressed]}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>
        {validation ? <Text accessibilityRole="alert" style={styles.validation}>{validation}</Text> : null}
      </View>
      {netInfo.isConnected === false ? <OfflineBanner /> : null}
      {query && books.length ? (
        <View style={styles.resultHeading}>
          <View><Text style={styles.resultLabel}>RESULTS FOR</Text><Text style={styles.queryText}>“{query}”</Text></View>
          <Text style={styles.count}>{total.toLocaleString()} found</Text>
        </View>
      ) : null}
    </>
  );

  let empty = <Feedback title="A library in your pocket" message="Search by title, author, or ISBN to start exploring." />;
  if (query && result.isPending) {
    empty = netInfo.isConnected === false
      ? <Feedback title="You’re offline" message="Connect once to search. Previous searches remain available offline." />
      : <Feedback loading title={isSlow ? 'Still searching…' : 'Searching the shelves…'} message={isSlow ? 'Your connection seems slower than usual. We’ll keep trying.' : undefined} />;
  } else if (query && result.isError) {
    empty = <Feedback title="Couldn’t load books" message={getErrorMessage(result.error)} actionLabel="Try again" onAction={() => result.refetch()} />;
  } else if (query && result.isSuccess && books.length === 0) {
    empty = <Feedback title="No books found" message="Try a different title, author, or a shorter search phrase." />;
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item, index) => `${item.workId}-${index}`}
      renderItem={({item}) => <BookCard book={item} onPress={() => navigation.navigate('BookDetails', {book: item})} />}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={result.isFetchingNextPage ? <ActivityIndicator color={colors.accent} style={styles.footer} /> : undefined}
      contentContainerStyle={books.length ? styles.list : styles.emptyList}
      ItemSeparatorComponent={ListSeparator}
      onEndReached={() => {if (result.hasNextPage && !result.isFetchingNextPage) result.fetchNextPage();}}
      onEndReachedThreshold={0.4}
      keyboardShouldPersistTaps="handled"
      refreshing={result.isRefetching && !result.isFetchingNextPage}
      onRefresh={query ? () => result.refetch() : undefined}
    />
  );
}

const styles = StyleSheet.create({
  list: {backgroundColor: colors.paper, paddingBottom: spacing.xxl}, emptyList: {backgroundColor: colors.paper, flexGrow: 1},
  hero: {backgroundColor: colors.ink, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg},
  eyebrow: {color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.8},
  heading: {color: colors.white, fontSize: 34, fontWeight: '900', letterSpacing: -1, lineHeight: 39, marginTop: spacing.sm, maxWidth: 340},
  subheading: {color: '#B8C1CF', fontSize: 15, lineHeight: 22, marginTop: spacing.sm},
  searchRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl},
  input: {backgroundColor: colors.white, borderRadius: 12, color: colors.ink, flex: 1, fontSize: 15, minHeight: 50, paddingHorizontal: spacing.lg},
  searchButton: {alignItems: 'center', backgroundColor: colors.accent, borderRadius: 12, justifyContent: 'center', paddingHorizontal: spacing.lg},
  buttonPressed: {opacity: 0.8}, searchButtonText: {color: colors.ink, fontWeight: '900'},
  validation: {color: '#FFB4A7', fontSize: 12, marginTop: spacing.sm},
  resultHeading: {alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.xl},
  resultLabel: {color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.3}, queryText: {color: colors.ink, fontSize: 22, fontWeight: '900', marginTop: 2},
  count: {color: colors.muted, fontSize: 12, marginBottom: 3}, separator: {height: spacing.md}, footer: {padding: spacing.xl},
});

