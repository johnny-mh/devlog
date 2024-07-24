export type LoadThemeResult = {
  preferred: 'dark' | 'light'
  theme: 'auto' | 'dark' | 'light'
}
export const loadTheme: () => LoadThemeResult = () => {
  if (typeof localStorage === 'undefined') {
    return { preferred: 'light', theme: 'auto' }
  }

  const value = localStorage.getItem('theme')

  return {
    preferred: matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark',
    theme: value === 'dark' || value === 'light' ? value : 'auto',
  }
}
