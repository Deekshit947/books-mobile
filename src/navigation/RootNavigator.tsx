import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BookDetailsScreen} from '../screens/BookDetailsScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {colors} from '../theme/theme';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: colors.ink}, headerTintColor: colors.white, headerTitleStyle: {fontWeight: '700'}, contentStyle: {backgroundColor: colors.paper}}}>
      <Stack.Screen name="Search" component={SearchScreen} options={{headerShown: false}} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{title: 'Book details', headerBackTitle: 'Search'}} />
    </Stack.Navigator>
  );
}
