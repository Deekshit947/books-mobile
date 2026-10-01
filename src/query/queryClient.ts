import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {queries: {
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    retry: failureCount => failureCount < 2,
    networkMode: 'offlineFirst',
  }},
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'BOOKS_MOBILE_QUERY_CACHE',
  throttleTime: 1000,
});
