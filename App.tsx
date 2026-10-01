import React from 'react';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer} from '@react-navigation/native';
import {onlineManager} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootNavigator} from './src/navigation/RootNavigator';
import {asyncStoragePersister, queryClient} from './src/query/queryClient';
import {navigationTheme} from './src/theme/theme';

onlineManager.setEventListener(setOnline =>
  NetInfo.addEventListener(state => setOnline(state.isConnected ?? false)),
);

export default function App() {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          buster: 'books-mobile-v1',
        }}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
        </NavigationContainer>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}

