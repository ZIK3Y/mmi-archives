export const Colors = {
  background: '#F7F6F3',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEDE8',
  border: '#E0DDD6',
  borderStrong: '#C8C4BC',

  textPrimary: '#1A1917',
  textSecondary: '#5C5954',
  textMuted: '#9C9892',

  accent: '#4A4E8C',
  accentLight: '#EAEBF5',
  accentText: '#FFFFFF',

  success: '#2D6A4F',
  successBg: '#D8F3DC',
  warning: '#B5530A',
  warningBg: '#FEE4CC',
  danger: '#9B1D20',
  dangerBg: '#FDDCDD',

  domaineWeb: '#1D4E89',
  domaineDev: '#1A5C3A',
  domaineDI: '#5C3A7C',
  domaine3D: '#7C4A1A',
  domaineCrea: '#8C2D3A',
  domaineAutre: '#4A4A4A',
};

export const DomaineColors: Record<string, { text: string; bg: string }> = {
  Web: { text: Colors.domaineWeb, bg: '#D6E4F0' },
  Développement: { text: Colors.domaineDev, bg: '#D8F3DC' },
  DI: { text: Colors.domaineDI, bg: '#EAD9F5' },
  '3D': { text: Colors.domaine3D, bg: '#F5E6D3' },
  Création: { text: Colors.domaineCrea, bg: '#F5D8DC' },
  Autre: { text: Colors.domaineAutre, bg: '#E8E8E8' },
};