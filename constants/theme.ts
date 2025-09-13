export const THEME = {
  colors: {
    primary: '#d90429',
    background: '#edf2f4',
    card: '#FFFFFF',
    text: '#2b2d42',
    mutedForeground: '#8d99ae',
    success: '#28a745',
    error: '#dc3545',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  typography: {
    sizes: {
      caption: 12,
      body: 16,
      subtitle: 18,
      title: 20,
      heading: 28,
      display: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
} as const;