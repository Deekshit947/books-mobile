import {Theme} from '@react-navigation/native';

export const colors = {
  ink: '#111827', inkSoft: '#273449', paper: '#F8F4EA', white: '#FFFFFF',
  accent: '#F9735B', accentDark: '#C94F3A', sky: '#DCE9F2', muted: '#64748B',
  border: '#E2DDD2', danger: '#B42318', dangerSoft: '#FEE4E2',
} as const;

export const spacing = {xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32} as const;

export const navigationTheme: Theme = {
  dark: false,
  colors: {primary: colors.accent, background: colors.paper, card: colors.ink, text: colors.white, border: colors.ink, notification: colors.accent},
  fonts: {
    regular: {fontFamily: 'System', fontWeight: '400'},
    medium: {fontFamily: 'System', fontWeight: '500'},
    bold: {fontFamily: 'System', fontWeight: '700'},
    heavy: {fontFamily: 'System', fontWeight: '800'},
  },
};
